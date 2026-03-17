import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Customer from '@/models/Customer';
import Plot from '@/models/Plot';
import { requireEmployee, requireAuth } from '@/lib/roleMiddleware';
import { generateReceiptPDF } from '@/lib/pdfService';
import { apiError } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const payment = await Payment.findById(params.id);
    if (!payment) return apiError('Payment not found', 404);

    const customer = await Customer.findById(payment.customerId).populate('userId');
    if (!customer) return apiError('Customer not found', 404);

    // Permission check: admin, employee, or the customer themselves
    if (user.role === 'customer' && customer.userId._id.toString() !== user._id.toString()) {
      return apiError('Unauthorized to view this receipt', 403);
    }

    const plot = await Plot.findById(payment.plotId);
    if (!plot) return apiError('Plot not found', 404);

    const buffer = await generateReceiptPDF(payment, customer, plot);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${payment.receiptNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Receipt generation error:', error);
    return apiError(error.message || 'Internal Server Error', 500);
  }
}
