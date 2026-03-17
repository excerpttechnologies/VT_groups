import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILand extends Document {
  plotNumber: string;
  landSize: string;
  ownerName: string;
  pricePerPlot: number;
  totalInstallmentAmount: number;
  monthlyInstallment: number;
  status: 'available' | 'sold' | 'reserved';
  soldDate?: Date;
  customerId?: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
  location: string;
  description?: string;
}

const LandSchema: Schema = new Schema(
  {
    plotNumber: { type: String, required: true, unique: true },
    landSize: { type: String, required: true },
    ownerName: { type: String, required: true },
    pricePerPlot: { type: Number, required: true },
    totalInstallmentAmount: { type: Number, required: true },
    monthlyInstallment: { type: Number, required: true },
    status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
    soldDate: { type: Date },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Land: Model<ILand> = mongoose.models.Land || mongoose.model<ILand>('Land', LandSchema);
export default Land;
