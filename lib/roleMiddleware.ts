import { NextRequest } from 'next/server';
import { verifyToken, apiError } from './auth';
import connectDB from './mongodb';
import User from '@/models/User';

export async function requireAuth(req: NextRequest) {
  // 1. Get token from cookies or Authorization header
  let token = req.cookies.get('token')?.value;

  if (!token) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    throw new Error('Unauthorized');
  }

  // 2. Verify token
  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    throw new Error('Invalid token');
  }

  // 3. Fetch user from DB
  await connectDB();
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) {
    throw new Error('User not found or inactive');
  }

  return user;
}

export async function requireAdmin(req: NextRequest) {
  const user = await requireAuth(req);
  if (user.role !== 'admin') {
    throw new Error('Access denied: Admin only');
  }
  return user;
}

export async function requireEmployee(req: NextRequest) {
  const user = await requireAuth(req);
  if (user.role !== 'admin' && user.role !== 'employee') {
    throw new Error('Access denied: Unauthorized role');
  }
  return user;
}

export async function requireCustomer(req: NextRequest) {
  const user = await requireAuth(req);
  // Any authenticated user can access customer-level data usually, 
  // but we might need more specific checks in the routes.
  return user;
}
