import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Payment from '@/models/Payment';
import { requireAdmin } from '@/lib/roleMiddleware';
import { apiResponse, apiError, generateTempPassword } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/emailService';
import { logActivity } from '@/lib/activityLogger';
import { z } from 'zod';

const employeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const query: any = { role: 'employee' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const totalCount = await User.countDocuments(query);
    const employeesData = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    // Enrich with customer count and monthly collection
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const enrichedEmployees = await Promise.all(employeesData.map(async (emp) => {
      const customerCount = await Customer.countDocuments({ assignedEmployee: emp._id });
      const monthlyCollection = await Payment.aggregate([
        { $match: { collectedBy: emp._id, status: 'Paid', paymentDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      return {
        ...emp.toObject(),
        customerCount,
        monthlyCollection: monthlyCollection[0]?.total || 0
      };
    }));

    return apiResponse({
      employees: enrichedEmployees,
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

    const validated = employeeSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Validation failed', 400, validated.error.format());
    }

    const { name, email, phone } = validated.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiError('Email already registered', 409);
    }

    const tempPassword = generateTempPassword();
    const employee = await User.create({
      name,
      email,
      password: tempPassword, // will be hashed by pre-save
      phone,
      role: 'employee',
      mustChangePassword: true,
      createdBy: admin._id
    });

    try {
      await sendWelcomeEmail(employee, tempPassword);
    } catch (e) {
      console.error('Failed to send credentials email:', e);
    }

    await logActivity({
      userId: admin._id.toString(),
      action: `Created employee: ${name}`,
      module: 'employees',
      req
    });

    return apiResponse(employee, 201, 'Employee created and credentials sent');

  } catch (error: any) {
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
