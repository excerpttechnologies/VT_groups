import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Land from '@/models/Land';
import { apiResponse, apiError, getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    let query: any = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;

    const lands = await Land.find(query).populate('customerId', 'name email').populate('employeeId', 'name');
    return apiResponse(lands);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user: any = await getUserFromRequest(req);
    if (!user || (user.role !== 'admin' && user.role !== 'employee')) {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const data = await req.json();
    const land = await Land.create(data);
    return apiResponse(land, 201);
  } catch (error: any) {
    return apiError(error.message);
  }
}
