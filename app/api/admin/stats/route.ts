import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Plot from '@/models/Plot';
import User from '@/models/User';
import Payment from '@/models/Payment';
import Customer from '@/models/Customer';
import { requireAdmin } from '@/lib/roleMiddleware';
import { apiResponse, apiError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Parallel queries for efficiency
    const [
      plotsByStatus,
      customerCount,
      employeeCount,
      totalRevenueData,
      monthlyRevenueData,
      overdueInstallments,
      recentPayments,
      topEmployees
    ] = await Promise.all([
      // Plot counts by status
      Plot.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      // Total customers
      Customer.countDocuments({ status: 'Active' }),

      // Total employees
      User.countDocuments({ role: 'employee', isActive: true }),

      // Total collection (all time)
      Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // Monthly collection (current month)
      Payment.aggregate([
        { $match: { status: 'Paid', paymentDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // Overdue check: Find installments where status=Pending and dueDate < today
      Customer.countDocuments({
        "installmentSchedule": {
          $elemMatch: {
            status: 'Pending',
            dueDate: { $lt: today }
          }
        }
      }),

      // Last 10 payments
      Payment.find({ status: 'Paid' })
        .sort({ paymentDate: -1 })
        .limit(10)
        .populate('plotId', 'plotNumber')
        .populate('collectedBy', 'name')
        .populate({
          path: 'customerId',
          populate: { path: 'userId', select: 'name' }
        }),

      // Top 5 employees by collection
      Payment.aggregate([
        { $match: { status: 'Paid', paymentDate: { $gte: startOfMonth } } },
        { $group: { _id: "$collectedBy", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: "$employee" },
        { $project: { name: "$employee.name", total: 1 } }
      ])
    ]);

    // Format stats response
    const stats = {
      plots: plotsByStatus.reduce((acc: any, curr: any) => {
        acc[curr._id.toLowerCase()] = curr.count;
        return acc;
      }, { available: 0, booked: 0, sold: 0, hold: 0 }),
      totalCustomers: customerCount,
      totalEmployees: employeeCount,
      totalRevenue: totalRevenueData[0]?.total || 0,
      monthlyRevenue: monthlyRevenueData[0]?.total || 0,
      overdueCount: overdueInstallments,
      recentPayments,
      topEmployees
    };

    return apiResponse(stats);
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
