import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  customerId: mongoose.Types.ObjectId;
  plotId: mongoose.Types.ObjectId;
  collectedBy: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMode: 'Cash' | 'Online' | 'Cheque' | 'DD';
  installmentNumber?: number;
  transactionId?: string;
  receiptNumber: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    plotId: { type: Schema.Types.ObjectId, ref: 'Plot', required: true },
    collectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: { 
      type: String, 
      enum: ['Cash', 'Online', 'Cheque', 'DD'], 
      required: true 
    },
    installmentNumber: { type: Number },
    transactionId: { type: String },
    receiptNumber: { type: String, required: true, unique: true },
    status: { 
      type: String, 
      enum: ['Paid', 'Pending', 'Failed', 'Refunded'], 
      default: 'Paid' 
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
