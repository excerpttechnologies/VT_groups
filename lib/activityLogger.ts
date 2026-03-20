import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import mongoose from 'mongoose';
import ActivityLog from '@/models/ActivityLog';

interface LogParams {
  userId: string;
  action: string;
  module: 'auth' | 'plots' | 'customers' | 'payments' | 'employees' | 'reports' | 'settings';
  meta?: any;
  req?: NextRequest;
}

export async function logActivity({
  userId,
  action,
  module,
  meta,
  req,
}: LogParams): Promise<void> {
  try {
    await connectDB();
    
    let ipAddress = '';
    let userAgent = '';

    if (req) {
      ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
      userAgent = req.headers.get('user-agent') || '';
    }

    // Ensure `userId` is stored as an ObjectId (prevents schema/cast issues).
    let userObjectId: any = userId;
    if (typeof userId === 'string') {
      try {
        userObjectId = new mongoose.Types.ObjectId(userId);
      } catch {
        // Fall back to original value; the create() will still validate/cast or fail.
        userObjectId = userId;
      }
    }

    await ActivityLog.create({
      userId: userObjectId,
      action,
      module,
      meta,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // We don't want to throw an error here as it shouldn't break the main flow
  }
}
