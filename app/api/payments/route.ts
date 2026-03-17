import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Customer from '@/models/Customer';
import Plot from '@/models/Plot';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { requireEmployee } from '@/lib/roleMiddleware';
import { apiResponse, apiError, generateReceiptNumber } from '@/lib/auth';
import { sendPaymentConfirmation } from '@/lib/emailService';
import { logActivity } from '@/lib/activityLogger';
import { z } from 'zod';

const paymentSchema = z.object({
  customerId: z.string(),
  amount: z.number().positive(),
  paymentMode: z.enum(['Cash', 'Online', 'Cheque', 'DD']),
  installmentNumber: z.number().int().optional(),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireEmployee(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const paymentMode = searchParams.get('paymentMode');
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    const query: any = {};
    if (user.role === 'employee') {
      query.collectedBy = user._id;
    } else if (employeeId) {
      query.collectedBy = employeeId;
    }

    if (paymentMode) query.paymentMode = paymentMode;
    if (status) query.status = status;

    const totalCount = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ paymentDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('plotId', 'plotNumber')
      .populate('collectedBy', 'name')
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name' }
      });

    return apiResponse({
      payments,
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

    const validated = paymentSchema.safeParse(body);
    if (!validated.success) {
      return apiError('Validation failed', 400, validated.error.format());
    }

    const { customerId, amount, paymentMode, installmentNumber, transactionId, remarks } = validated.data;

    // 1. Find customer
    const customer = await Customer.findById(customerId).populate('userId');
    if (!customer) return apiError('Customer not found', 404);

    const plot = await Plot.findById(customer.assignedPlot);
    if (!plot) return apiError('Plot not found', 404);

    // 2. Verify installment if provided
    if (installmentNumber !== undefined) {
      const installmentIndex = customer.installmentSchedule.findIndex(inst => inst.month === installmentNumber);
      if (installmentIndex === -1) return apiError('Installment number not found', 400);

      // We'll update it later
      customer.installmentSchedule[installmentIndex].status = 'Paid';
      customer.installmentSchedule[installmentIndex].paidDate = new Date();
    }

    // 3. Auto-generate receiptNumber
    const receiptNumber = generateReceiptNumber();

    // 4. Create Payment document
    const payment = await Payment.create({
      customerId,
      plotId: customer.assignedPlot,
      collectedBy: employee._id,
      amount,
      paymentMode,
      installmentNumber,
      transactionId,
      receiptNumber,
      status: 'Paid',
      remarks
    });

    // 5. Update Customer stats
    customer.paidInstallments += 1;
    customer.totalPaid += amount;

    // 6. Check if ALL paid
    const pendingCount = customer.installmentSchedule.filter(inst => inst.status !== 'Paid' && inst.status !== 'Waived').length;
    if (pendingCount === 0) {
      customer.status = 'Completed';
      plot.status = 'Sold';
      await plot.save();
    }

    if (installmentNumber !== undefined) {
      const idx = customer.installmentSchedule.findIndex(i => i.month === installmentNumber);
      customer.installmentSchedule[idx].paymentId = payment._id;
    }

    await customer.save();

    // 7. Create notification
    await Notification.create({
      userId: customer.userId._id,
      title: 'Payment Received',
      message: `Payment of ₹${amount} received for ${installmentNumber ? `installment #${installmentNumber}` : 'plot payment'}.`,
      type: 'payment',
      link: `/customer/payments`
    });

    // 8. Send confirmation email
    try {
      await sendPaymentConfirmation(customer.userId, payment, customer);
    } catch (e) {
      console.error('Email failed:', e);
    }

    // 9. Log activity
    await logActivity({
      userId: employee._id.toString(),
      action: `Collected payment of ₹${amount} from ${customer.userId.name}`,
      module: 'payments',
      req
    });

    return apiResponse(payment, 201);
  } catch (error: any) {
    console.error('Payment error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
