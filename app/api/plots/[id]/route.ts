import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Plot from '@/models/Plot';
import Customer from '@/models/Customer';
import { requireEmployee, requireAdmin } from '@/lib/roleMiddleware';
import { apiResponse, apiError } from '@/lib/auth';
import { logActivity } from '@/lib/activityLogger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEmployee(req);
    await connectDB();

    const plot = await Plot.findById(params.id).populate('createdBy', 'name');
    if (!plot) return apiError('Plot not found', 404);

    let customerInfo = null;
    if (plot.status !== 'Available') {
      customerInfo = await Customer.findOne({ assignedPlot: params.id })
        .populate('userId', 'name email phone');
    }

    return apiResponse({ plot, customer: customerInfo });
  } catch (error: any) {
    return apiError(error.message);
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

    const plot = await Plot.findByIdAndUpdate(params.id, data, { new: true });
    if (!plot) return apiError('Plot not found', 404);

    await logActivity({
      userId: admin._id.toString(),
      action: `Updated plot: ${plot.plotNumber}`,
      module: 'plots',
      req
    });

    return apiResponse(plot);
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

    const plot = await Plot.findById(params.id);
    if (!plot) return apiError('Plot not found', 404);

    if (plot.status !== 'Available') {
      return apiError('Cannot delete a plot that is already booked or sold', 400);
    }

    await Plot.findByIdAndDelete(params.id);

    await logActivity({
      userId: admin._id.toString(),
      action: `Deleted plot: ${plot.plotNumber}`,
      module: 'plots',
      req
    });

    return apiResponse(null, 200, 'Plot deleted successfully');
  } catch (error: any) {
    return apiError(error.message);
  }
}
