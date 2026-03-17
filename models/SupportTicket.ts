import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupportTicket extends Document {
  raisedBy: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  status: 'Open' | 'InProgress' | 'Resolved' | 'Closed';
  adminReply?: string;
  repliedBy?: mongoose.Types.ObjectId;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema: Schema = new Schema(
  {
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Open', 'InProgress', 'Resolved', 'Closed'], 
      default: 'Open' 
    },
    adminReply: { type: String },
    repliedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

const SupportTicket: Model<ISupportTicket> = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
export default SupportTicket;
