import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
// Import all models to ensure they are registered with Mongoose
import '@/models';
import Installment from '@/models/Installment';
import { apiResponse, apiError, getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth) return apiError('Unauthorized', 401);

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const landId = searchParams.get('landId');
    const status = searchParams.get('status');

    let query: any = {};
    if (userAuth.role === 'customer') {
      query.customerId = userAuth.id;
    } else if (customerId) {
      query.customerId = customerId;
    }
    if (landId) query.landId = landId;
    if (status) query.status = status;

    const installments = await Installment.find(query)
      .populate('landId', 'plotNumber')
      .populate('customerId', 'name')
      .sort({ monthNumber: 1 });

    return apiResponse(installments);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth || (userAuth.role !== 'admin' && userAuth.role !== 'employee')) {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const data = await req.json();
    const installment = await Installment.create(data);
    return apiResponse(installment, 201);
  } catch (error: any) {
    return apiError(error.message);
  }
}
