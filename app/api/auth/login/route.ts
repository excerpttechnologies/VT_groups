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
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Validate input
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Invalid input', 400, validated.error.format());
    }

    const { email, password } = validated.data;

    // 2. Find user (include password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`[AUTH] Login failed: User not found for email: ${email}`);
      return apiError('Invalid credentials', 401);
    }

    // 3. Check isActive
    if (!user.isActive) {
      console.log(`[AUTH] Login failed: Account deactivated for email: ${email}`);
      return apiError('Account is deactivated', 403);
    }

    // 4. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[AUTH] Login failed: Invalid password for email: ${email}`);
      return apiError('Invalid credentials', 401);
    }

    console.log(`[AUTH] Login successful for email: ${email}`);

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
    }, 200, 'Login successful');

  } catch (error: any) {
    console.error('Login error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
