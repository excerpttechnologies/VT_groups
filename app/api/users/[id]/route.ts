import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { apiResponse, apiError, getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth || (userAuth.role !== 'admin' && userAuth.id !== params.id)) {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const user = await User.findById(params.id).select('-password');
    if (!user) return apiError('User not found', 404);
    return apiResponse(user);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth || (userAuth.role !== 'admin' && userAuth.id !== params.id)) {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const data = await req.json();
    
    // Safety: Don't allow role change unless admin
    if (data.role && userAuth.role !== 'admin') {
      delete data.role;
    }

    const user = await User.findByIdAndUpdate(params.id, data, { new: true }).select('-password');
    if (!user) return apiError('User not found', 404);
    return apiResponse(user);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth || userAuth.role !== 'admin') {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) return apiError('User not found', 404);
    return apiResponse(null, 200, 'User deleted successfully');
  } catch (error: any) {
    return apiError(error.message);
  }
}
