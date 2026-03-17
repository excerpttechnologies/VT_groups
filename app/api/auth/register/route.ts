import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, apiError, apiResponse } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/emailService';
import { logActivity } from '@/lib/activityLogger';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Zod validate
    const validated = registerSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Validation failed', 400, validated.error.format());
    }

    const { name, email, password, phone } = validated.data;

    // 2. Check email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiError('Email already registered', 409);
    }

    // 3. Create User with role: 'customer'
    // Model pre-save hook will hash the password
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer',
    });

    // 4. Set JWT cookie
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 5. Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // 6. Log activity
    await logActivity({
      userId: user._id.toString(),
      action: 'User registered',
      module: 'auth',
      req,
    });

    return apiResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, 201, 'Registration successful');

  } catch (error: any) {
    console.error('Registration error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
