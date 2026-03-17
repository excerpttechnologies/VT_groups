import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Plot from '@/models/Plot';
import Customer from '@/models/Customer';
import Payment from '@/models/Payment';
import Settings from '@/models/Settings';
import { apiResponse, apiError } from '@/lib/auth';
import { generateInstallmentSchedule } from '@/lib/installmentHelper';

export async function GET(req: NextRequest) {
  // DISABLE IN PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    return apiError('Seeding is disabled in production', 403);
  }

  try {
    await connectDB();

    // Clear existing data (optional, but good for clean seed)
    await Promise.all([
      User.deleteMany({}),
      Plot.deleteMany({}),
      Customer.deleteMany({}),
      Payment.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    // 1. Create Demo Accounts
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@vtgroups.com',
      password: 'Admin@123',
      role: 'admin',
      isActive: true,
      mustChangePassword: false
    });

    const employee = await User.create({
      name: 'Employee User',
      email: 'employee@vtgroups.com',
      password: 'Emp@123',
      role: 'employee',
      isActive: true,
      mustChangePassword: false,
      createdBy: admin._id
    });

    const customerUser = await User.create({
      name: 'Customer User',
      email: 'customer@vtgroups.com',
      password: 'Cust@123',
      role: 'customer',
      isActive: true,
      mustChangePassword: false,
      createdBy: employee._id
    });

    // 2. Create Sample Plots
    const plots = await Plot.insertMany([
      { plotNumber: 'VT-001', location: 'Green Valley, Phase 1', area: 200, areaUnit: 'sqyard', totalPrice: 1500000, status: 'Available', plotType: 'Residential', createdBy: admin._id },
      { plotNumber: 'VT-002', location: 'Green Valley, Phase 1', area: 150, areaUnit: 'sqyard', totalPrice: 1100000, status: 'Sold', plotType: 'Residential', createdBy: admin._id },
      { plotNumber: 'VT-003', location: 'City Center', area: 50, areaUnit: 'sqyard', totalPrice: 5000000, status: 'Available', plotType: 'Commercial', createdBy: admin._id },
      { plotNumber: 'VT-004', location: 'Highland Gardens', area: 250, areaUnit: 'sqyard', totalPrice: 2000000, status: 'Available', plotType: 'Residential', createdBy: admin._id },
      { plotNumber: 'VT-005', location: 'Green Valley, Phase 2', area: 180, areaUnit: 'sqyard', totalPrice: 1350000, status: 'Available', plotType: 'Residential', createdBy: admin._id },
    ]);

    // 3. Link customer with Plot VT-002
    const schedule = generateInstallmentSchedule({
      totalAmount: 1100000,
      downPayment: 200000,
      installmentMonths: 12,
      startDate: new Date('2024-01-01')
    });

    const customer = await Customer.create({
      userId: customerUser._id,
      assignedPlot: plots[1]._id,
      assignedEmployee: employee._id,
      totalAmount: 1100000,
      downPayment: 200000,
      installmentMonths: 12,
      installmentAmount: Math.ceil((1100000 - 200000) / 12),
      installmentSchedule: schedule,
      status: 'Active'
    });

    // 4. Create Settings
    await Settings.create({
      companyName: "VT Groups",
      email: "contact@vtgroups.com",
      phone: "+91 9876543210",
      address: "123 Business Hub, Hyderabad, India"
    });

    return apiResponse({ 
      message: 'Database seeded successfully',
      credentials: [
        { role: 'admin', email: 'admin@vtgroups.com', pass: 'Admin@123' },
        { role: 'employee', email: 'employee@vtgroups.com', pass: 'Emp@123' },
        { role: 'customer', email: 'customer@vtgroups.com', pass: 'Cust@123' }
      ]
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return apiError(error.message || 'Seed failed', 500);
  }
}
