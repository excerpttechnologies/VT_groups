import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Plot from '@/models/Plot';
import { requireEmployee, requireAdmin } from '@/lib/roleMiddleware';
import { apiResponse, apiError, generatePlotNumber } from '@/lib/auth';
import { logActivity } from '@/lib/activityLogger';
import { z } from 'zod';

const plotSchema = z.object({
  plotNumber: z.string().min(3).optional(),
  location: z.string().min(2),
  area: z.coerce.number().positive(),
  areaUnit: z.enum(['sqft', 'sqyard', 'acre', 'gunta']).default('sqyard'),
  totalPrice: z.coerce.number().positive(),
  facing: z.enum(['East', 'West', 'North', 'South']).optional(),
  plotType: z.enum(['Residential', 'Commercial', 'Agricultural']).optional(),
  description: z.string().optional(),
  status: z.enum(['Available', 'Booked', 'Sold', 'Hold']).default('Available'),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireEmployee(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const facing = searchParams.get('facing');
    const search = searchParams.get('search') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');

    const query: any = {};
    if (status) query.status = status;
    if (type) query.plotType = type;
    if (facing) query.facing = facing;
    if (search) {
      query.$or = [
        { plotNumber: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    query.totalPrice = { $gte: minPrice, $lte: maxPrice };

    const totalCount = await Plot.countDocuments(query);
    const plots = await Plot.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name');

    // Fetch corresponding customers for these plots
    const plotIds = plots.map(p => p._id);
    const customers = await (mongoose.models.Customer || (await import('@/models/Customer')).default).find({ assignedPlot: { $in: plotIds } })
      .populate('userId', 'name')
      .populate('assignedEmployee', 'name');

    const plotsWithCustomers = plots.map(plot => {
      const customerDoc = customers.find(c => c.assignedPlot.toString() === plot._id.toString());
      return {
        ...plot.toObject(),
        customer: customerDoc ? {
          name: (customerDoc.userId as any)?.name,
          employeeName: (customerDoc.assignedEmployee as any)?.name
        } : null
      };
    });

    return apiResponse({
      plots: plotsWithCustomers,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });

  } catch (error: any) {
    return apiError(error.message || 'Internal Server Error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const validated = plotSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Validation failed', 400, validated.error.format());
    }

    // Use provided plotNumber if present, else auto-generate.
    let plotNumber = validated.data.plotNumber?.trim();
    if (!plotNumber) {
      // Auto-generate plotNumber with retry (handles concurrent creates).
      const lastPlot = await Plot.findOne().sort({ createdAt: -1 }).select('plotNumber');
      let lastNum = 0;
      if (lastPlot && typeof lastPlot.plotNumber === 'string' && lastPlot.plotNumber.startsWith('VT-')) {
        lastNum = parseInt(lastPlot.plotNumber.split('-')[1]) || 0;
      }

      let created: any = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        plotNumber = generatePlotNumber(lastNum + attempt);
        try {
          created = await Plot.create({
            ...validated.data,
            plotNumber,
            createdBy: admin._id
          });
          break;
        } catch (err: any) {
          // Retry on duplicate key only
          if (err?.code === 11000) continue;
          throw err;
        }
      }
      if (!created) {
        return apiError('Could not generate a unique plot number. Please retry.', 409);
      }

      await logActivity({
        userId: admin._id.toString(),
        action: `Created plot: ${plotNumber}`,
        module: 'plots',
        req
      });

      return apiResponse(created, 201);
    }

    // If plotNumber is provided, enforce uniqueness cleanly
    const exists = await Plot.findOne({ plotNumber }).select('_id');
    if (exists) {
      return apiError(`Plot number "${plotNumber}" already exists`, 409);
    }

    const plot = await Plot.create({
      ...validated.data,
      plotNumber,
      createdBy: admin._id
    });

    await logActivity({
      userId: admin._id.toString(),
      action: `Created plot: ${plotNumber}`,
      module: 'plots',
      req
    });

    return apiResponse(plot, 201);
  } catch (error: any) {
    if (error?.code === 11000) {
      return apiError('Duplicate plotNumber. Please use a different plot number.', 409);
    }
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
