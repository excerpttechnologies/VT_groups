import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Land from '@/models/Land';
import { apiResponse, apiError, getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const land = await Land.findById(params.id).populate('customerId').populate('employeeId');
    if (!land) return apiError('Land not found', 404);
    return apiResponse(land);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user: any = await getUserFromRequest(req);
    if (!user || (user.role !== 'admin' && user.role !== 'employee')) {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const data = await req.json();
    const land = await Land.findByIdAndUpdate(params.id, data, { new: true });
    if (!land) return apiError('Land not found', 404);
    return apiResponse(land);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user: any = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();
    const land = await Land.findByIdAndDelete(params.id);
    if (!land) return apiError('Land not found', 404);
    return apiResponse(null, 200, 'Land deleted successfully');
  } catch (error: any) {
    return apiError(error.message);
  }
}
