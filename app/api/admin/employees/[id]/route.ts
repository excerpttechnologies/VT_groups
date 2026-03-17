import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Payment from '@/models/Payment';
import { requireAdmin } from '@/lib/roleMiddleware';
import { apiResponse, apiError } from '@/lib/auth';
import { logActivity } from '@/lib/activityLogger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    await connectDB();

    const employee = await User.findById(params.id).select('-password');
    if (!employee || employee.role !== 'employee') {
      return apiError('Employee not found', 404);
    }

    const customers = await Customer.find({ assignedEmployee: params.id })
      .populate('userId', 'name email phone')
      .populate('assignedPlot', 'plotNumber location');

    const collectionSummary = await Payment.aggregate([
      { $match: { collectedBy: employee._id, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    return apiResponse({
      employee,
      customers,
      summary: collectionSummary[0] || { total: 0, count: 0 }
    });
  } catch (error: any) {
    return apiError(error.message || 'Internal Server Error', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const data = await req.json();

    const employee = await User.findByIdAndUpdate(params.id, data, { new: true }).select('-password');
    if (!employee) return apiError('Employee not found', 404);

    await logActivity({
      userId: admin._id.toString(),
      action: `Updated employee: ${employee.name}`,
      module: 'employees',
      req
    });

    return apiResponse(employee);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();

    // Soft delete
    const employee = await User.findByIdAndUpdate(params.id, { isActive: false }, { new: true });
    if (!employee) return apiError('Employee not found', 404);

    await logActivity({
      userId: admin._id.toString(),
      action: `Deactivated employee: ${employee.name}`,
      module: 'employees',
      req
    });

    return apiResponse(null, 200, 'Employee deactivated successfully');
  } catch (error: any) {
    return apiError(error.message);
  }
}
