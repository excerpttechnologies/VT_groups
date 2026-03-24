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
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    // ============= STEP 1: VALIDATE ENVIRONMENT =============
    if (!process.env.JWT_SECRET) {
      console.error(`[LOGIN-${requestId}] ❌ CRITICAL: JWT_SECRET not set. Using fallback (INSECURE!)`);
    }
    console.log(`[LOGIN-${requestId}] ℹ️ NODE_ENV: ${process.env.NODE_ENV}`);

    // ============= STEP 2: CONNECT TO DATABASE =============
    console.log(`[LOGIN-${requestId}] 🔌 Connecting to MongoDB...`);
    try {
      await connectDB();
      console.log(`[LOGIN-${requestId}] ✅ MongoDB connected`);
    } catch (dbError: any) {
      console.error(`[LOGIN-${requestId}] ❌ MongoDB connection failed:`, dbError.message);
      return apiError('Database connection failed. Please try again.', 500);
    }

    // ============= STEP 3: PARSE REQUEST BODY =============
    let body;
    try {
      body = await req.json();
      console.log(`[LOGIN-${requestId}] 📨 Request body received. Email: ${body.email}`);
    } catch (parseError: any) {
      console.error(`[LOGIN-${requestId}] ❌ Failed to parse JSON:`, parseError.message);
      return apiError('Invalid JSON in request body', 400);
    }

    // ============= STEP 4: VALIDATE INPUT SCHEMA =============
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      console.warn(`[LOGIN-${requestId}] ⚠️ Validation failed:`, validated.error.format());
      return apiError('Invalid input', 400, validated.error.format());
    }

    const { email, password, role } = validated.data;
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`[LOGIN-${requestId}] ✅ Input validation passed. Email: ${normalizedEmail}, Role: ${role || 'auto'}`);

    // ============= STEP 5: FIND USER IN DATABASE =============
    console.log(`[LOGIN-${requestId}] 🔍 Searching for user in database...`);
    let user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      console.log(`[LOGIN-${requestId}] ℹ️ User not found. Attempting admin bootstrap (dev-only)...`);
      
      // Try to bootstrap admin if configured
      const didBootstrapAdmin = await ensureConfiguredAdmin({ email: normalizedEmail, password });
      if (didBootstrapAdmin) {
        console.log(`[LOGIN-${requestId}] ✅ Admin bootstrapped successfully`);
        user = await User.findOne({ email: normalizedEmail }).select('+password');
      } else {
        console.log(`[LOGIN-${requestId}] ❌ User not found & admin bootstrap failed`);
        return apiError('Invalid credentials', 401);
      }
    } else {
      console.log(`[LOGIN-${requestId}] ✅ User found in database. ID: ${user._id}, Role: ${user.role}, Active: ${user.isActive}`);
    }

    // ============= STEP 6: CHECK ACCOUNT STATUS =============
    if (!user.isActive) {
      console.log(`[LOGIN-${requestId}] ❌ Account is deactivated for email: ${normalizedEmail}`);
      return apiError('Account is deactivated', 403);
    }
    console.log(`[LOGIN-${requestId}] ✅ Account is active`);

    // ============= STEP 7: VALIDATE ROLE (IF PROVIDED) =============
    if (role && role !== user.role) {
      console.log(`[LOGIN-${requestId}] ❌ Role mismatch. Expected: ${role}, Got: ${user.role}`);
      return apiError('Invalid credentials', 401);
    }
    console.log(`[LOGIN-${requestId}] ✅ Role validation passed`);

    // ============= STEP 8: COMPARE PASSWORD =============
    console.log(`[LOGIN-${requestId}] 🔐 Comparing password...`);
    let isMatch = false;
    try {
      isMatch = await user.comparePassword(password);
    } catch (compareError: any) {
      console.error(`[LOGIN-${requestId}] ❌ Password comparison error:`, compareError.message);
      return apiError('Password verification failed', 500);
    }

    if (!isMatch) {
      console.log(`[LOGIN-${requestId}] ❌ Password mismatch for email: ${normalizedEmail}`);
      return apiError('Invalid credentials', 401);
    }
    console.log(`[LOGIN-${requestId}] ✅ Password matched`);

    // ============= STEP 9: UPGRADE PLAINTEXT PASSWORDS =============
    const storedPassword = user.password as unknown;
    const storedLooksBcrypt = looksLikeBcryptHash(storedPassword);
    if (!storedLooksBcrypt) {
      console.log(`[LOGIN-${requestId}] 🔄 Upgrading plaintext password to bcrypt...`);
      user.password = password;
      user.lastLoginAt = new Date();
      await user.save();
      console.log(`[LOGIN-${requestId}] ✅ Password upgraded to bcrypt`);
    } else {
      console.log(`[LOGIN-${requestId}] ✅ Password already bcrypted`);
      await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
    }

    // ============= STEP 10: GENERATE JWT TOKEN =============
    console.log(`[LOGIN-${requestId}] 🔑 Generating JWT token...`);
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    if (!token) {
      console.error(`[LOGIN-${requestId}] ❌ JWT generation failed`);
      return apiError('Token generation failed', 500);
    }
    console.log(`[LOGIN-${requestId}] ✅ JWT token generated. Token length: ${token.length} chars`);

    // ============= STEP 11: SET HTTP-ONLY COOKIE =============
    console.log(`[LOGIN-${requestId}] 🍪 Setting httpOnly cookie...`);
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      };
      console.log(`[LOGIN-${requestId}] 🍪 Cookie options:`, {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        maxAge: `${cookieOptions.maxAge / 86400} days`,
      });
      
      (await cookies()).set('token', token, cookieOptions);
      console.log(`[LOGIN-${requestId}] ✅ Cookie set successfully`);
    } catch (cookieError: any) {
      console.error(`[LOGIN-${requestId}] ⚠️ Cookie setting error:`, cookieError.message);
      // Continue anyway - token is valid even if cookie fails
    }

    // ============= STEP 12: LOG ACTIVITY =============
    try {
      await logActivity({
        userId: user._id.toString(),
        action: 'User logged in',
        module: 'auth',
        req,
      });
      console.log(`[LOGIN-${requestId}] ✅ Activity logged`);
    } catch (logError: any) {
      console.warn(`[LOGIN-${requestId}] ⚠️ Activity logging failed:`, logError.message);
      // Don't fail login if activity logging fails
    }

    // ============= STEP 13: RETURN SUCCESS RESPONSE =============
    const duration = Date.now() - startTime;
    console.log(`[LOGIN-${requestId}] ✅ LOGIN SUCCESSFUL in ${duration}ms`);
    
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
    const duration = Date.now() - startTime;
    console.error(`[LOGIN-${requestId}] ❌ UNEXPECTED ERROR after ${duration}ms:`, {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 3),
    });
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
