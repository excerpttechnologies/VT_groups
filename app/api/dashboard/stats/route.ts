import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Land from '@/models/Land';
import User from '@/models/User';
import Payment from '@/models/Payment';
import Installment from '@/models/Installment';
import { apiResponse, apiError, getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userAuth: any = await getUserFromRequest(req);
    if (!userAuth || userAuth.role !== 'admin') {
      return apiError('Unauthorized', 403);
    }

    await dbConnect();

    const [lands, users, payments, installments] = await Promise.all([
      Land.find({}),
      User.find({}),
      Payment.find({}),
      Installment.find({}),
    ]);

    const stats = {
      totalLands: lands.length,
      soldPlots: lands.filter(l => l.status === 'sold').length,
      availablePlots: lands.filter(l => l.status === 'available').length,
      reservedPlots: lands.filter(l => l.status === 'reserved').length,
      totalCustomers: users.filter(u => u.role === 'customer').length,
      totalEmployees: users.filter(u => u.role === 'employee').length,
      totalRevenue: payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: installments
        .filter(i => i.status === 'pending' || i.status === 'overdue')
        .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
      landStatusDistribution: [
        { name: 'Sold', value: lands.filter(l => l.status === 'sold').length },
        { name: 'Available', value: lands.filter(l => l.status === 'available').length },
        { name: 'Reserved', value: lands.filter(l => l.status === 'reserved').length },
      ],
    };

    return apiResponse(stats);
  } catch (error: any) {
    return apiError(error.message);
  }
}
