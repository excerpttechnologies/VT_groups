import PDFDocument from 'pdfkit';
import { formatINR, formatDate } from './formatters';

export async function generateReceiptPDF(payment: any, customer: any, plot: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: any[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Header
    doc.fontSize(25).text('VT GROUPS', { align: 'center' });
    doc.fontSize(10).text('Land Management & Distribution', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Receipt Meta
    doc.fontSize(16).text('PAYMENT RECEIPT', { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Receipt No: ${payment.receiptNumber}`);
    doc.text(`Date: ${formatDate(payment.paymentDate)}`);
    doc.moveDown();

    // Customer Details
    doc.fontSize(14).text('Customer Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${customer.userId.name}`);
    doc.text(`Email: ${customer.userId.email}`);
    doc.text(`Phone: ${customer.userId.phone || 'N/A'}`);
    doc.moveDown();

    // Plot Details
    doc.fontSize(14).text('Plot Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Plot Number: ${plot.plotNumber}`);
    doc.text(`Location: ${plot.location}`);
    doc.text(`Total Price: ${formatINR(plot.totalPrice)}`);
    doc.moveDown();

    // Payment Details
    doc.fontSize(14).text('Payment Information', { underline: true });
    doc.fontSize(12);
    doc.text(`Amount Paid: ${formatINR(payment.amount)}`);
    doc.text(`Payment Mode: ${payment.paymentMode}`);
    if (payment.transactionId) doc.text(`Transaction ID: ${payment.transactionId}`);
    doc.text(`Installment No: ${payment.installmentNumber || 'N/A'}`);
    doc.moveDown();

    // Footer
    doc.moveDown(4);
    doc.fontSize(10).text('This is a computer generated receipt and does not require a physical signature.', { align: 'center', color: 'grey' });
    doc.text('© VT Groups Land Management', { align: 'center' });

    doc.end();
  });
}

export async function generateCollectionReportPDF(data: any[], filters: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: any[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    doc.fontSize(20).text('VT GROUPS - Collection Report', { align: 'center' });
    doc.fontSize(10).text(`Generated on: ${formatDate(new Date())}`, { align: 'center' });
    doc.moveDown();

    if (filters.from && filters.to) {
      doc.text(`Period: ${formatDate(filters.from)} to ${formatDate(filters.to)}`, { align: 'center' });
      doc.moveDown();
    }

    // Summary
    const total = data.reduce((sum, p) => sum + p.amount, 0);
    doc.fontSize(14).text(`Total Collection: ${formatINR(total)}`, { bold: true });
    doc.moveDown();

    // Table Header
    const tableTop = doc.y;
    doc.fontSize(10);
    doc.text('Date', 50, tableTop);
    doc.text('Receipt No', 120, tableTop);
    doc.text('Customer', 220, tableTop);
    doc.text('Plot', 350, tableTop);
    doc.text('Amount', 450, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Rows
    let y = tableTop + 25;
    data.forEach((p) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc.text(formatDate(p.paymentDate), 50, y);
      doc.text(p.receiptNumber, 120, y);
      doc.text(p.customerId?.userId?.name || 'N/A', 220, y);
      doc.text(p.plotId?.plotNumber || 'N/A', 350, y);
      doc.text(formatINR(p.amount), 450, y);
      y += 20;
    });

    doc.end();
  });
}
