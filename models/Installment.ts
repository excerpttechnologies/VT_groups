import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInstallment extends Document {
  landId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  monthNumber: number;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentId?: mongoose.Types.ObjectId;
}

const InstallmentSchema: Schema = new Schema(
  {
    landId: { type: Schema.Types.ObjectId, ref: 'Land', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    monthNumber: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

const Installment: Model<IInstallment> = mongoose.models.Installment || mongoose.model<IInstallment>('Installment', InstallmentSchema);
export default Installment;
