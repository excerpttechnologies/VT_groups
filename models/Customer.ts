import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInstallmentScheduleItem {
  month: number;
  dueDate: Date;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Waived';
  paidDate?: Date;
  paymentId?: mongoose.Types.ObjectId;
}

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  assignedPlot: mongoose.Types.ObjectId;
  assignedEmployee: mongoose.Types.ObjectId;
  totalAmount: number;
  downPayment: number;
  downPaymentDate?: Date;
  installmentMonths: number;
  installmentAmount: number;
  startDate: Date;
  paidInstallments: number;
  totalPaid: number;
  installmentSchedule: IInstallmentScheduleItem[];
  documents: string[];
  notes?: string;
  status: 'Active' | 'Completed' | 'Defaulter' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    assignedPlot: { type: Schema.Types.ObjectId, ref: 'Plot', required: true },
    assignedEmployee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    downPayment: { type: Number, default: 0 },
    downPaymentDate: { type: Date },
    installmentMonths: { type: Number, required: true },
    installmentAmount: { type: Number },
    startDate: { type: Date, default: Date.now },
    paidInstallments: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    installmentSchedule: [
      {
        month: { type: Number },
        dueDate: { type: Date },
        amount: { type: Number },
        status: { 
          type: String, 
          enum: ['Pending', 'Paid', 'Overdue', 'Waived'], 
          default: 'Pending' 
        },
        paidDate: { type: Date },
        paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
      },
    ],
    documents: [{ type: String }],
    notes: { type: String },
    status: { 
      type: String, 
      enum: ['Active', 'Completed', 'Defaulter', 'Cancelled'], 
      default: 'Active' 
    },
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;
