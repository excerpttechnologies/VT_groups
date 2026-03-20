import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, apiError, apiResponse } from '@/lib/auth';
import { logActivity } from '@/lib/activityLogger';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'employee', 'customer']).optional(),
});

function looksLikeBcryptHash(maybeHash: unknown): maybeHash is string {
  if (typeof maybeHash !== 'string') return false;
  return /^\$2[aby]?\$\d{2}\$/.test(maybeHash) || /^\$2\$\d{2}\$/.test(maybeHash);
}

async function ensureConfiguredAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<boolean> {
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@vtgroups.com').trim().toLowerCase();
  const configuredAdminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== configuredAdminEmail) return false;

  // Only bootstrap in non-production to avoid auto-creating admin accounts unexpectedly.
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) return false;

  if (password !== configuredAdminPassword) return false;

  // Upsert admin account idempotently.
  const existing = await User.findOne({ email: configuredAdminEmail });
  if (!existing) {
    await User.create({
      name: 'Admin User',
      email: configuredAdminEmail,
      password: configuredAdminPassword,
      role: 'admin',
      isActive: true,
      mustChangePassword: false,
    });
    return true;
  }

  if (existing.role !== 'admin') {
    existing.role = 'admin';
    existing.isActive = true;
    await existing.save();
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Validate input
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Invalid input', 400, validated.error.format());
    }

    const { email, password, role } = validated.data;
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user (include password)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      // If configured admin email isn't in DB yet, bootstrap it (dev-only).
      const didBootstrapAdmin = await ensureConfiguredAdmin({ email: normalizedEmail, password });
      if (didBootstrapAdmin) {
        const adminUser = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!adminUser) {
          return apiError('Invalid credentials', 401);
        }
        // Continue with adminUser.
        const isMatch = await adminUser.comparePassword(password);
        if (!isMatch) return apiError('Invalid credentials', 401);

        if (role && role !== adminUser.role) return apiError('Invalid credentials', 401);

        const storedPassword = adminUser.password as unknown;
        const storedLooksBcrypt = looksLikeBcryptHash(storedPassword);
        const now = new Date();
        if (!storedLooksBcrypt) {
          adminUser.password = password;
          adminUser.lastLoginAt = now;
          await adminUser.save();
        } else {
          await User.updateOne({ _id: adminUser._id }, { $set: { lastLoginAt: now } });
        }

        const token = signToken({
          id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role,
          name: adminUser.name,
        });

        (await cookies()).set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        await logActivity({
          userId: adminUser._id.toString(),
          action: 'User logged in',
          module: 'auth',
          req,
        });

        return apiResponse({
          user: {
            id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          },
          mustChangePassword: adminUser.mustChangePassword,
          lastLoginAt: adminUser.lastLoginAt,
        }, 200, 'Login successful');
      }

      console.log(`[AUTH] Login failed: User not found for email: ${normalizedEmail}`);
      return apiError('Invalid credentials', 401);
    }

    // 3. Check isActive
    if (!user.isActive) {
      console.log(`[AUTH] Login failed: Account deactivated for email: ${normalizedEmail}`);
      return apiError('Account is deactivated', 403);
    }

    // Optional: if UI provides role, ensure it matches DB role.
    if (role && role !== user.role) {
      return apiError('Invalid credentials', 401);
    }

    // 4. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[AUTH] Login failed: Invalid password for email: ${normalizedEmail}`);
      return apiError('Invalid credentials', 401);
    }

    // 4b. If the stored password was legacy plaintext, upgrade it to bcrypt on successful login.
    const storedPassword = user.password as unknown;
    const storedLooksBcrypt = looksLikeBcryptHash(storedPassword);
    const now = new Date();
    if (!storedLooksBcrypt) {
      user.password = password; // triggers pre('save') hashing
      user.lastLoginAt = now;
      await user.save();
    } else {
      // Avoid re-saving password field; just write lastLoginAt.
      await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: now } });
    }

    console.log(`[AUTH] Login successful for email: ${normalizedEmail}`);

    // 5. Generate JWT
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 6. Set httpOnly cookie
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 7. Log activity
    await logActivity({
      userId: user._id.toString(),
      action: 'User logged in',
      module: 'auth',
      req,
    });

    // 8. Return response
    return apiResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
    }, 200, 'Login successful');

  } catch (error: any) {
    console.error('Login error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
