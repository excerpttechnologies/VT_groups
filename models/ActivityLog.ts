import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  module: 'auth' | 'plots' | 'customers' | 'payments' | 'employees' | 'reports' | 'settings';
  meta?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    module: { 
      type: String, 
      enum: ['auth', 'plots', 'customers', 'payments', 'employees', 'reports', 'settings'],
      required: true
    },
    meta: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
