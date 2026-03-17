// Database Seeder Script
// Run with: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed.ts
// Or: node -e "require('./scripts/seed.js')"

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://excerptvps_db_user:FHZ6b9XbkTo6eeWC@excerpterp.tx52fsw.mongodb.net/land_management';

// Schemas defined inline for standalone script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'employee', 'customer'], default: 'customer' },
  phone: { type: String },
  avatar: { type: String },
}, { timestamps: true });

const LandSchema = new mongoose.Schema({
  plotNumber: { type: String, required: true, unique: true },
  landSize: { type: String, required: true },
  ownerName: { type: String, required: true },
  pricePerPlot: { type: Number, required: true },
  totalInstallmentAmount: { type: Number, required: true },
  monthlyInstallment: { type: Number, required: true },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  soldDate: { type: Date },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'online'], required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
  notes: { type: String },
}, { timestamps: true });

const InstallmentSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  monthNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Land = mongoose.models.Land || mongoose.model('Land', LandSchema);
    const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
    const Installment = mongoose.models.Installment || mongoose.model('Installment', InstallmentSchema);

    // Clear existing data
    await User.deleteMany({});
    await Land.deleteMany({});
    await Payment.deleteMany({});
    await Installment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Rajesh Kumar',
      email: 'admin@vtgroups.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 9876543210',
    });

    const emp1 = await User.create({
      name: 'Amit Sharma',
      email: 'amit@vtgroups.com',
      password: hashedPassword,
      role: 'employee',
      phone: '+91 9876543211',
    });

    const emp2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@vtgroups.com',
      password: hashedPassword,
      role: 'employee',
      phone: '+91 9876543212',
    });

    const cust1 = await User.create({
      name: 'Vikram Singh',
      email: 'vikram@email.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+91 9876543213',
    });

    const cust2 = await User.create({
      name: 'Sunita Devi',
      email: 'sunita@email.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+91 9876543214',
    });

    const cust3 = await User.create({
      name: 'Mohan Lal',
      email: 'mohan@email.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+91 9876543217',
    });

    console.log('👤 Created users');

    // Create Lands
    const land1 = await Land.create({
      plotNumber: 'VT-001', landSize: '1200 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 1500000, totalInstallmentAmount: 1500000, monthlyInstallment: 25000,
      status: 'sold', soldDate: new Date('2023-06-15'),
      customerId: cust1._id, employeeId: emp1._id,
      location: 'Sector 45, Noida', description: 'Premium corner plot with park view',
    });

    const land2 = await Land.create({
      plotNumber: 'VT-002', landSize: '1000 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 1200000, totalInstallmentAmount: 1200000, monthlyInstallment: 20000,
      status: 'sold', soldDate: new Date('2023-07-20'),
      customerId: cust2._id, employeeId: emp2._id,
      location: 'Sector 45, Noida', description: 'East facing plot with road access',
    });

    await Land.create({
      plotNumber: 'VT-003', landSize: '1500 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 1800000, totalInstallmentAmount: 1800000, monthlyInstallment: 30000,
      status: 'available',
      location: 'Sector 46, Noida', description: 'Large plot suitable for villa construction',
    });

    await Land.create({
      plotNumber: 'VT-004', landSize: '800 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 950000, totalInstallmentAmount: 950000, monthlyInstallment: 16000,
      status: 'available',
      location: 'Sector 47, Noida', description: 'Compact plot with great connectivity',
    });

    await Land.create({
      plotNumber: 'VT-005', landSize: '2000 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 2400000, totalInstallmentAmount: 2400000, monthlyInstallment: 40000,
      status: 'reserved',
      location: 'Sector 44, Noida', description: 'Premium double plot with all amenities',
    });

    const land6 = await Land.create({
      plotNumber: 'VT-006', landSize: '1100 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 1320000, totalInstallmentAmount: 1320000, monthlyInstallment: 22000,
      status: 'sold', soldDate: new Date('2023-09-10'),
      customerId: cust1._id, employeeId: emp1._id,
      location: 'Sector 48, Noida', description: 'Well-maintained plot in gated community',
    });

    await Land.create({
      plotNumber: 'VT-007', landSize: '900 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 1080000, totalInstallmentAmount: 1080000, monthlyInstallment: 18000,
      status: 'available',
      location: 'Sector 49, Noida', description: 'Budget-friendly residential plot',
    });

    await Land.create({
      plotNumber: 'VT-008', landSize: '1400 sq ft', ownerName: 'VT Groups',
      pricePerPlot: 1680000, totalInstallmentAmount: 1680000, monthlyInstallment: 28000,
      status: 'available',
      location: 'Sector 50, Noida', description: 'Spacious plot with metro connectivity',
    });

    console.log('🏗️  Created lands');

    // Create Payments
    const pay1 = await Payment.create({ landId: land1._id, customerId: cust1._id, employeeId: emp1._id, amount: 25000, method: 'online', date: new Date('2024-01-15'), status: 'completed', notes: 'January installment' });
    const pay2 = await Payment.create({ landId: land1._id, customerId: cust1._id, employeeId: emp1._id, amount: 25000, method: 'cash', date: new Date('2024-02-15'), status: 'completed', notes: 'February installment' });
    const pay3 = await Payment.create({ landId: land2._id, customerId: cust2._id, employeeId: emp2._id, amount: 20000, method: 'online', date: new Date('2024-01-20'), status: 'completed', notes: 'January installment' });
    const pay4 = await Payment.create({ landId: land2._id, customerId: cust2._id, employeeId: emp2._id, amount: 20000, method: 'cash', date: new Date('2024-02-20'), status: 'completed', notes: 'February installment' });
    await Payment.create({ landId: land1._id, customerId: cust1._id, employeeId: emp1._id, amount: 25000, method: 'online', date: new Date('2024-03-15'), status: 'pending', notes: 'March installment' });
    const pay6 = await Payment.create({ landId: land6._id, customerId: cust1._id, employeeId: emp1._id, amount: 22000, method: 'cash', date: new Date('2024-01-10'), status: 'completed', notes: 'January installment' });
    const pay7 = await Payment.create({ landId: land6._id, customerId: cust1._id, employeeId: emp1._id, amount: 22000, method: 'online', date: new Date('2024-02-10'), status: 'completed', notes: 'February installment' });

    console.log('💰 Created payments');

    // Create Installments
    await Installment.create({ landId: land1._id, customerId: cust1._id, monthNumber: 1, dueDate: new Date('2024-01-15'), amount: 25000, paidAmount: 25000, status: 'paid', paymentId: pay1._id });
    await Installment.create({ landId: land1._id, customerId: cust1._id, monthNumber: 2, dueDate: new Date('2024-02-15'), amount: 25000, paidAmount: 25000, status: 'paid', paymentId: pay2._id });
    await Installment.create({ landId: land1._id, customerId: cust1._id, monthNumber: 3, dueDate: new Date('2024-03-15'), amount: 25000, paidAmount: 0, status: 'pending' });
    await Installment.create({ landId: land2._id, customerId: cust2._id, monthNumber: 1, dueDate: new Date('2024-01-20'), amount: 20000, paidAmount: 20000, status: 'paid', paymentId: pay3._id });
    await Installment.create({ landId: land2._id, customerId: cust2._id, monthNumber: 2, dueDate: new Date('2024-02-20'), amount: 20000, paidAmount: 20000, status: 'paid', paymentId: pay4._id });
    await Installment.create({ landId: land2._id, customerId: cust2._id, monthNumber: 3, dueDate: new Date('2024-03-20'), amount: 20000, paidAmount: 0, status: 'overdue' });
    await Installment.create({ landId: land6._id, customerId: cust1._id, monthNumber: 1, dueDate: new Date('2024-01-10'), amount: 22000, paidAmount: 22000, status: 'paid', paymentId: pay6._id });
    await Installment.create({ landId: land6._id, customerId: cust1._id, monthNumber: 2, dueDate: new Date('2024-02-10'), amount: 22000, paidAmount: 22000, status: 'paid', paymentId: pay7._id });

    console.log('📅 Created installments');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin:    admin@vtgroups.com / password123');
    console.log('   Employee: amit@vtgroups.com  / password123');
    console.log('   Employee: priya@vtgroups.com / password123');
    console.log('   Customer: vikram@email.com   / password123');
    console.log('   Customer: sunita@email.com   / password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
