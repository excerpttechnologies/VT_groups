import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  companyName: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  installmentReminderDays: number;
  isEmailEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    companyName: { type: String, default: "VT Groups" },
    logo: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    currency: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    installmentReminderDays: { type: Number, default: 3 },
    isEmailEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
export default Settings;
