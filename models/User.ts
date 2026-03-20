import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'admin' | 'employee' | 'customer';
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  profilePhoto?: string;
  address?: string;
  mustChangePassword: boolean;
  lastLoginAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: { 
      type: String, 
      enum: ['admin', 'employee', 'customer'], 
      default: 'customer' 
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    profilePhoto: { type: String },
    address: { type: String },
    mustChangePassword: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

function looksLikeBcryptHash(maybeHash: unknown): maybeHash is string {
  if (typeof maybeHash !== 'string') return false;
  // bcrypt hashes start with $2a$, $2b$, $2y$ (or $2$ in some configs)
  return /^\$2[aby]?\$\d{2}\$/.test(maybeHash) || /^\$2\$\d{2}\$/.test(maybeHash);
}

// Pre-save hook to hash password
UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (err: any) {
    throw err;
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const stored = this.password || '';
  if (!stored) return false;

  // Backward compatible: some legacy rows might store plaintext password.
  // Prefer bcrypt whenever the stored value looks like a bcrypt hash.
  if (looksLikeBcryptHash(stored)) {
    return bcrypt.compare(candidatePassword, stored);
  }

  return stored === candidatePassword;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
