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
  try {
    // Allow in dev mode OR with valid seed token in production
    const seedToken = req.nextUrl.searchParams.get('token');
    const validToken = process.env.SEED_TOKEN || 'seed-token-dev';
    
    const isProduction = process.env.NODE_ENV === 'production';
    const isAuthorized = !isProduction || seedToken === validToken;

    if (!isAuthorized) {
      return apiError('Seeding is disabled in production without valid token', 403);
    }

    await connectDB();

    // NOTE: Seeding should be idempotent. We avoid deleting collections here to prevent
    // duplicate-key races and to preserve data when seed is hit multiple times.

    // 1. Create Demo Accounts
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@vtgroups.com').trim().toLowerCase();
    const configuredAdminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const admin = await User.findOneAndUpdate(
      { email: configuredAdminEmail },
      {
        $set: {
          name: 'Admin User',
          role: 'admin',
          isActive: true,
          mustChangePassword: false,
        },
        $setOnInsert: {
          password: configuredAdminPassword, // will be hashed by pre-save only on create; handled below
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select('+password');

    // If admin was newly inserted via $setOnInsert, password may not have gone through pre-save in findOneAndUpdate.
    // Ensure password is hashed by setting and saving when needed.
    if (admin && typeof (admin as any).password === 'string' && !(admin as any).password.startsWith('$2')) {
      (admin as any).password = configuredAdminPassword;
      await admin.save();
    }

    const employee = await User.findOneAndUpdate(
      { email: 'employee@vtgroups.com' },
      {
        $set: {
          name: 'Employee User',
          role: 'employee',
          isActive: true,
          mustChangePassword: false,
          createdBy: admin._id
        },
        $setOnInsert: { password: 'Emp@123' },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select('+password');
    if (employee && typeof (employee as any).password === 'string' && !(employee as any).password.startsWith('$2')) {
      (employee as any).password = 'Emp@123';
      await employee.save();
    }

    const customerUser = await User.findOneAndUpdate(
      { email: 'customer@vtgroups.com' },
      {
        $set: {
          name: 'Customer User',
          role: 'customer',
          isActive: true,
          mustChangePassword: false,
          createdBy: employee._id
        },
        $setOnInsert: { password: 'Cust@123' },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select('+password');
    if (customerUser && typeof (customerUser as any).password === 'string' && !(customerUser as any).password.startsWith('$2')) {
      (customerUser as any).password = 'Cust@123';
      await customerUser.save();
    }

    // 2. Create Sample Plots
    const seedPlots = [
      { plotNumber: 'VT-001', location: 'Green Valley, Phase 1', area: 200, areaUnit: 'sqyard', totalPrice: 1500000, status: 'Available', plotType: 'Residential' },
      { plotNumber: 'VT-002', location: 'Green Valley, Phase 1', area: 150, areaUnit: 'sqyard', totalPrice: 1100000, status: 'Sold', plotType: 'Residential' },
      { plotNumber: 'VT-003', location: 'City Center', area: 50, areaUnit: 'sqyard', totalPrice: 5000000, status: 'Available', plotType: 'Commercial' },
      { plotNumber: 'VT-004', location: 'Highland Gardens', area: 250, areaUnit: 'sqyard', totalPrice: 2000000, status: 'Available', plotType: 'Residential' },
      { plotNumber: 'VT-005', location: 'Green Valley, Phase 2', area: 180, areaUnit: 'sqyard', totalPrice: 1350000, status: 'Available', plotType: 'Residential' },
    ];

    await Plot.bulkWrite(
      seedPlots.map((p) => ({
        updateOne: {
          filter: { plotNumber: p.plotNumber },
          update: { $set: { ...p, createdBy: admin._id } },
          upsert: true,
        }
      })),
      { ordered: false }
    );

    const plots = await Plot.find({ plotNumber: { $in: seedPlots.map(p => p.plotNumber) } }).sort({ plotNumber: 1 });

    // 3. Link customer with Plot VT-002
    const schedule = generateInstallmentSchedule({
      totalAmount: 1100000,
      downPayment: 200000,
      installmentMonths: 12,
      startDate: new Date('2024-01-01')
    });

    await Customer.findOneAndUpdate(
      { userId: customerUser._id },
      {
        $set: {
          userId: customerUser._id,
          assignedPlot: plots.find(p => p.plotNumber === 'VT-002')?._id,
          assignedEmployee: employee._id,
          totalAmount: 1100000,
          downPayment: 200000,
          installmentMonths: 12,
          installmentAmount: Math.ceil((1100000 - 200000) / 12),
          installmentSchedule: schedule,
          status: 'Active'
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 4. Create Settings
    await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          companyName: "VT Groups",
          email: "contact@vtgroups.com",
          phone: "+91 9876543210",
          address: "123 Business Hub, Hyderabad, India"
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return apiResponse({ 
      message: 'Database seeded successfully',
      credentials: [
        { role: 'admin', email: configuredAdminEmail, pass: configuredAdminPassword },
        { role: 'employee', email: 'employee@vtgroups.com', pass: 'Emp@123' },
        { role: 'customer', email: 'customer@vtgroups.com', pass: 'Cust@123' }
      ]
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return apiError(error.message || 'Seed failed', 500);
  }
}
