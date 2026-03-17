import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { apiResponse, apiError, getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth || (userAuth.role !== 'admin' && userAuth.role !== 'employee')) {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    let query: any = {};
    if (role) query.role = role;

    const users = await User.find(query);
    return apiResponse(users);
  } catch (error: any) {
    return apiError(error.message);
  }
}
