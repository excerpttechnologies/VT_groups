import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
// Import all models to ensure they are registered with Mongoose
import '@/models';
import Customer from '@/models/Customer';
import { requireEmployee, requireAdmin } from '@/lib/roleMiddleware';
import { apiResponse, apiError } from '@/lib/auth';
import { logActivity } from '@/lib/activityLogger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEmployee(req);
    await connectDB();

    const customer = await Customer.findById(params.id)
      .populate('userId', 'name email phone profilePhoto address')
      .populate('assignedPlot')
      .populate('assignedEmployee', 'name email');

    if (!customer) return apiError('Customer not found', 404);

    // Visibility check
    if (user.role === 'employee' && customer.assignedEmployee.toString() !== user._id.toString()) {
      return apiError('Unauthorized access to this customer', 403);
    }

    return apiResponse(customer);
  } catch (error: any) {
    return apiError(error.message);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireEmployee(req);
    await connectDB();
    const data = await req.json();

    const customer = await Customer.findById(params.id);
    if (!customer) return apiError('Customer not found', 404);

    // Permission check
    if (user.role === 'employee' && customer.assignedEmployee.toString() !== user._id.toString()) {
      return apiError('Unauthorized to update this customer', 403);
    }

    const updated = await Customer.findByIdAndUpdate(params.id, data, { new: true });

    await logActivity({
      userId: user._id.toString(),
      action: `Updated customer data: ${params.id}`,
      module: 'customers',
      req
    });

    return apiResponse(updated);
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

    const customer = await Customer.findById(params.id);
    if (!customer) return apiError('Customer not found', 404);

    await Customer.findByIdAndDelete(params.id);

    await logActivity({
      userId: admin._id.toString(),
      action: `Deleted customer record: ${params.id}`,
      module: 'customers',
      req
    });

    return apiResponse(null, 200, 'Customer deleted successfully');
  } catch (error: any) {
    return apiError(error.message);
  }
}
