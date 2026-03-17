import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlot extends Document {
  plotNumber: string;
  location: string;
  area: number;
  areaUnit: 'sqft' | 'sqyard' | 'acre' | 'gunta';
  totalPrice: number;
  pricePerUnit: number;
  facing: 'East' | 'West' | 'North' | 'South';
  plotType: 'Residential' | 'Commercial' | 'Agricultural';
  status: 'Available' | 'Booked' | 'Sold' | 'Hold';
  description?: string;
  images: string[];
  documents: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlotSchema: Schema = new Schema(
  {
    plotNumber: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    area: { type: Number, required: true },
    areaUnit: { 
      type: String, 
      enum: ['sqft', 'sqyard', 'acre', 'gunta'], 
      default: 'sqyard' 
    },
    totalPrice: { type: Number, required: true },
    pricePerUnit: { type: Number },
    facing: { 
      type: String, 
      enum: ['East', 'West', 'North', 'South'] 
    },
    plotType: { 
      type: String, 
      enum: ['Residential', 'Commercial', 'Agricultural'] 
    },
    status: { 
      type: String, 
      enum: ['Available', 'Booked', 'Sold', 'Hold'], 
      default: 'Available' 
    },
    description: { type: String },
    images: [{ type: String }],
    documents: [{ type: String }],
    amenities: [{ type: String }],
    latitude: { type: Number },
    longitude: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Pre-save hook to calculate pricePerUnit
PlotSchema.pre('save', function (this: IPlot) {
  if (this.totalPrice && this.area) {
    this.pricePerUnit = this.totalPrice / this.area;
  }
});

const Plot: Model<IPlot> = mongoose.models.Plot || mongoose.model<IPlot>('Plot', PlotSchema);
export default Plot;
