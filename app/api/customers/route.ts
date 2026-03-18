import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
// Import all models to ensure they are registered with Mongoose
import '@/models';
import Customer from '@/models/Customer';
import User from '@/models/User';
import Plot from '@/models/Plot';
import Notification from '@/models/Notification';
import { requireEmployee } from '@/lib/roleMiddleware';
import { apiResponse, apiError, generateTempPassword } from '@/lib/auth';
import { generateInstallmentSchedule } from '@/lib/installmentHelper';
import { sendWelcomeEmail } from '@/lib/emailService';
import { logActivity } from '@/lib/activityLogger';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  assignedPlot: z.string(),
  totalAmount: z.number().positive(),
  downPayment: z.number().min(0),
  installmentMonths: z.number().int().positive(),
  startDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireEmployee(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    if (user.role === 'employee') {
      query.assignedEmployee = user._id;
    }
    if (status) query.status = status;

    const customers = await Customer.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedPlot', 'plotNumber location')
      .populate('assignedEmployee', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Basic search filtering if name is provided (post-query or via aggregation if needed)
    // For simplicity, we'll just filter names here if searching
    let filtered = customers;
    if (search) {
      filtered = customers.filter(c => 
        (c.userId as any).name.toLowerCase().includes(search.toLowerCase()) ||
        (c.userId as any).email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalCount = await Customer.countDocuments(query);

    return apiResponse({
      customers: filtered,
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
    const employee = await requireEmployee(req);
    await connectDB();
    const body = await req.json();

    const validated = customerSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Validation failed', 400, validated.error.format());
    }

    const { name, email, phone, assignedPlot, totalAmount, downPayment, installmentMonths, startDate, notes } = validated.data;

    // 1. Check plot availability
    const plot = await Plot.findById(assignedPlot);
    if (!plot || plot.status !== 'Available') {
      return apiError('Plot is not available', 400);
    }

    // 2. Create User account for customer
    let customerUser = await User.findOne({ email });
    let tempPassword = '';
    if (!customerUser) {
      tempPassword = generateTempPassword();
      customerUser = await User.create({
        name,
        email,
        password: tempPassword,
        phone,
        role: 'customer',
        isActive: true,
        createdBy: employee._id
      });
    }

    // 3. Generate installment schedule
    const schedule = generateInstallmentSchedule({
      totalAmount,
      downPayment,
      installmentMonths,
      startDate: startDate ? new Date(startDate) : new Date(),
    });

    const installmentAmount = schedule[0]?.amount || 0;

    // 4. Create Customer document
    const customer = await Customer.create({
      userId: customerUser._id,
      assignedPlot,
      assignedEmployee: employee._id,
      totalAmount,
      downPayment,
      downPaymentDate: new Date(),
      installmentMonths,
      installmentAmount,
      startDate: startDate ? new Date(startDate) : new Date(),
      installmentSchedule: schedule,
      notes,
      status: 'Active'
    });

    // 5. Update Plot status to 'Booked'
    plot.status = 'Booked';
    await plot.save();

    // 6. Create welcome notification
    await Notification.create({
      userId: customerUser._id,
      title: 'Welcome to VT Groups',
      message: `Your booking for Plot ${plot.plotNumber} has been confirmed.`,
      type: 'info'
    });

    // 7. Send welcome email
    try {
      await sendWelcomeEmail(customerUser, tempPassword);
    } catch (e) {
      console.error('Email failed:', e);
    }

    // 8. Log activity
    await logActivity({
      userId: employee._id.toString(),
      action: `Created customer: ${name} for Plot ${plot.plotNumber}`,
      module: 'customers',
      req
    });

    return apiResponse(customer, 201);
  } catch (error: any) {
    console.error('Customer creation error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
