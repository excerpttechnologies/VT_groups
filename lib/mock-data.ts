// Mock data for the Land Distribution & Installment Management System

export type UserRole = 'admin' | 'employee' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Land {
  id: string;
  plotNumber: string;
  landSize: string;
  ownerName: string;
  pricePerPlot: number;
  totalInstallmentAmount: number;
  monthlyInstallment: number;
  status: 'available' | 'sold' | 'reserved';
  soldDate?: string;
  customerId?: string;
  employeeId?: string;
  location: string;
  description?: string;
}

export interface Payment {
  id: string;
  landId: string;
  customerId: string;
  employeeId: string;
  amount: number;
  method: 'cash' | 'online';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface Installment {
  id: string;
  landId: string;
  customerId: string;
  monthNumber: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentId?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedLands: string[];
  totalCollections: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  lands: string[];
  totalPurchases: number;
  totalPaid: number;
  pendingBalance: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  { id: 'admin-1', name: 'Rajesh Kumar', email: 'admin@vtgroups.com', role: 'admin', phone: '+91 9876543210', createdAt: '2023-01-01' },
  { id: 'emp-1', name: 'Amit Sharma', email: 'amit@vtgroups.com', role: 'employee', phone: '+91 9876543211', createdAt: '2023-03-15' },
  { id: 'emp-2', name: 'Priya Patel', email: 'priya@vtgroups.com', role: 'employee', phone: '+91 9876543212', createdAt: '2023-04-20' },
  { id: 'cust-1', name: 'Vikram Singh', email: 'vikram@email.com', role: 'customer', phone: '+91 9876543213', createdAt: '2023-06-01' },
  { id: 'cust-2', name: 'Sunita Devi', email: 'sunita@email.com', role: 'customer', phone: '+91 9876543214', createdAt: '2023-07-15' },
];

// Mock Lands
export const mockLands: Land[] = [
  { id: 'land-1', plotNumber: 'VT-001', landSize: '1200 sq ft', ownerName: 'VT Groups', pricePerPlot: 1500000, totalInstallmentAmount: 1500000, monthlyInstallment: 25000, status: 'sold', soldDate: '2023-06-15', customerId: 'cust-1', employeeId: 'emp-1', location: 'Sector 45, Noida', description: 'Premium corner plot with park view' },
  { id: 'land-2', plotNumber: 'VT-002', landSize: '1000 sq ft', ownerName: 'VT Groups', pricePerPlot: 1200000, totalInstallmentAmount: 1200000, monthlyInstallment: 20000, status: 'sold', soldDate: '2023-07-20', customerId: 'cust-2', employeeId: 'emp-2', location: 'Sector 45, Noida', description: 'East facing plot with road access' },
  { id: 'land-3', plotNumber: 'VT-003', landSize: '1500 sq ft', ownerName: 'VT Groups', pricePerPlot: 1800000, totalInstallmentAmount: 1800000, monthlyInstallment: 30000, status: 'available', location: 'Sector 46, Noida', description: 'Large plot suitable for villa construction' },
  { id: 'land-4', plotNumber: 'VT-004', landSize: '800 sq ft', ownerName: 'VT Groups', pricePerPlot: 950000, totalInstallmentAmount: 950000, monthlyInstallment: 16000, status: 'available', location: 'Sector 47, Noida', description: 'Compact plot with great connectivity' },
  { id: 'land-5', plotNumber: 'VT-005', landSize: '2000 sq ft', ownerName: 'VT Groups', pricePerPlot: 2400000, totalInstallmentAmount: 2400000, monthlyInstallment: 40000, status: 'reserved', location: 'Sector 44, Noida', description: 'Premium double plot with all amenities' },
  { id: 'land-6', plotNumber: 'VT-006', landSize: '1100 sq ft', ownerName: 'VT Groups', pricePerPlot: 1320000, totalInstallmentAmount: 1320000, monthlyInstallment: 22000, status: 'sold', soldDate: '2023-09-10', customerId: 'cust-1', employeeId: 'emp-1', location: 'Sector 48, Noida', description: 'Well-maintained plot in gated community' },
  { id: 'land-7', plotNumber: 'VT-007', landSize: '900 sq ft', ownerName: 'VT Groups', pricePerPlot: 1080000, totalInstallmentAmount: 1080000, monthlyInstallment: 18000, status: 'available', location: 'Sector 49, Noida', description: 'Budget-friendly residential plot' },
  { id: 'land-8', plotNumber: 'VT-008', landSize: '1400 sq ft', ownerName: 'VT Groups', pricePerPlot: 1680000, totalInstallmentAmount: 1680000, monthlyInstallment: 28000, status: 'available', location: 'Sector 50, Noida', description: 'Spacious plot with metro connectivity' },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  { id: 'emp-1', name: 'Amit Sharma', email: 'amit@vtgroups.com', phone: '+91 9876543211', assignedLands: ['land-1', 'land-6'], totalCollections: 450000, status: 'active', joinedDate: '2023-03-15' },
  { id: 'emp-2', name: 'Priya Patel', email: 'priya@vtgroups.com', phone: '+91 9876543212', assignedLands: ['land-2'], totalCollections: 320000, status: 'active', joinedDate: '2023-04-20' },
  { id: 'emp-3', name: 'Rahul Verma', email: 'rahul@vtgroups.com', phone: '+91 9876543215', assignedLands: [], totalCollections: 0, status: 'active', joinedDate: '2023-08-01' },
  { id: 'emp-4', name: 'Neha Gupta', email: 'neha@vtgroups.com', phone: '+91 9876543216', assignedLands: [], totalCollections: 180000, status: 'inactive', joinedDate: '2023-02-10' },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  { id: 'cust-1', name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 9876543213', address: '123 Main Street, Delhi', lands: ['land-1', 'land-6'], totalPurchases: 2820000, totalPaid: 450000, pendingBalance: 2370000, status: 'active', joinedDate: '2023-06-01' },
  { id: 'cust-2', name: 'Sunita Devi', email: 'sunita@email.com', phone: '+91 9876543214', address: '456 Park Avenue, Gurgaon', lands: ['land-2'], totalPurchases: 1200000, totalPaid: 320000, pendingBalance: 880000, status: 'active', joinedDate: '2023-07-15' },
  { id: 'cust-3', name: 'Mohan Lal', email: 'mohan@email.com', phone: '+91 9876543217', address: '789 Lake View, Noida', lands: [], totalPurchases: 0, totalPaid: 0, pendingBalance: 0, status: 'active', joinedDate: '2023-10-01' },
  { id: 'cust-4', name: 'Anita Rao', email: 'anita@email.com', phone: '+91 9876543218', address: '321 Hill Road, Faridabad', lands: [], totalPurchases: 1500000, totalPaid: 1500000, pendingBalance: 0, status: 'inactive', joinedDate: '2022-11-15' },
];

// Mock Payments
export const mockPayments: Payment[] = [
  { id: 'pay-1', landId: 'land-1', customerId: 'cust-1', employeeId: 'emp-1', amount: 25000, method: 'online', date: '2024-01-15', status: 'completed', notes: 'January installment' },
  { id: 'pay-2', landId: 'land-1', customerId: 'cust-1', employeeId: 'emp-1', amount: 25000, method: 'cash', date: '2024-02-15', status: 'completed', notes: 'February installment' },
  { id: 'pay-3', landId: 'land-2', customerId: 'cust-2', employeeId: 'emp-2', amount: 20000, method: 'online', date: '2024-01-20', status: 'completed', notes: 'January installment' },
  { id: 'pay-4', landId: 'land-2', customerId: 'cust-2', employeeId: 'emp-2', amount: 20000, method: 'cash', date: '2024-02-20', status: 'completed', notes: 'February installment' },
  { id: 'pay-5', landId: 'land-1', customerId: 'cust-1', employeeId: 'emp-1', amount: 25000, method: 'online', date: '2024-03-15', status: 'pending', notes: 'March installment' },
  { id: 'pay-6', landId: 'land-6', customerId: 'cust-1', employeeId: 'emp-1', amount: 22000, method: 'cash', date: '2024-01-10', status: 'completed', notes: 'January installment' },
  { id: 'pay-7', landId: 'land-6', customerId: 'cust-1', employeeId: 'emp-1', amount: 22000, method: 'online', date: '2024-02-10', status: 'completed', notes: 'February installment' },
];

// Mock Installments
export const mockInstallments: Installment[] = [
  { id: 'inst-1', landId: 'land-1', customerId: 'cust-1', monthNumber: 1, dueDate: '2024-01-15', amount: 25000, paidAmount: 25000, status: 'paid', paymentId: 'pay-1' },
  { id: 'inst-2', landId: 'land-1', customerId: 'cust-1', monthNumber: 2, dueDate: '2024-02-15', amount: 25000, paidAmount: 25000, status: 'paid', paymentId: 'pay-2' },
  { id: 'inst-3', landId: 'land-1', customerId: 'cust-1', monthNumber: 3, dueDate: '2024-03-15', amount: 25000, paidAmount: 0, status: 'pending' },
  { id: 'inst-4', landId: 'land-2', customerId: 'cust-2', monthNumber: 1, dueDate: '2024-01-20', amount: 20000, paidAmount: 20000, status: 'paid', paymentId: 'pay-3' },
  { id: 'inst-5', landId: 'land-2', customerId: 'cust-2', monthNumber: 2, dueDate: '2024-02-20', amount: 20000, paidAmount: 20000, status: 'paid', paymentId: 'pay-4' },
  { id: 'inst-6', landId: 'land-2', customerId: 'cust-2', monthNumber: 3, dueDate: '2024-03-20', amount: 20000, paidAmount: 0, status: 'overdue' },
  { id: 'inst-7', landId: 'land-6', customerId: 'cust-1', monthNumber: 1, dueDate: '2024-01-10', amount: 22000, paidAmount: 22000, status: 'paid', paymentId: 'pay-6' },
  { id: 'inst-8', landId: 'land-6', customerId: 'cust-1', monthNumber: 2, dueDate: '2024-02-10', amount: 22000, paidAmount: 22000, status: 'paid', paymentId: 'pay-7' },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: 'notif-1', title: 'Payment Received', message: 'Payment of ₹25,000 received from Vikram Singh for plot VT-001', type: 'success', read: false, createdAt: '2024-03-15T10:30:00' },
  { id: 'notif-2', title: 'Overdue Payment', message: 'Installment for plot VT-002 is overdue by 5 days', type: 'warning', read: false, createdAt: '2024-03-14T09:00:00' },
  { id: 'notif-3', title: 'New Customer', message: 'New customer Mohan Lal has registered', type: 'info', read: true, createdAt: '2024-03-13T14:20:00' },
  { id: 'notif-4', title: 'Land Sold', message: 'Plot VT-006 has been sold to Vikram Singh', type: 'success', read: true, createdAt: '2024-03-10T11:45:00' },
];

// Dashboard Stats
export const dashboardStats = {
  totalLands: mockLands.length,
  soldPlots: mockLands.filter(l => l.status === 'sold').length,
  availablePlots: mockLands.filter(l => l.status === 'available').length,
  reservedPlots: mockLands.filter(l => l.status === 'reserved').length,
  totalCustomers: mockCustomers.length,
  activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
  totalEmployees: mockEmployees.length,
  activeEmployees: mockEmployees.filter(e => e.status === 'active').length,
  totalRevenue: mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
  pendingPayments: mockInstallments.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
  monthlyCollections: [
    { month: 'Oct', amount: 180000 },
    { month: 'Nov', amount: 220000 },
    { month: 'Dec', amount: 195000 },
    { month: 'Jan', amount: 270000 },
    { month: 'Feb', amount: 310000 },
    { month: 'Mar', amount: 250000 },
  ],
  landStatusDistribution: [
    { name: 'Sold', value: mockLands.filter(l => l.status === 'sold').length, color: 'var(--chart-1)' },
    { name: 'Available', value: mockLands.filter(l => l.status === 'available').length, color: 'var(--chart-2)' },
    { name: 'Reserved', value: mockLands.filter(l => l.status === 'reserved').length, color: 'var(--chart-3)' },
  ],
};

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'sold':
    case 'paid':
    case 'completed':
    case 'active':
      return 'text-green-500 bg-green-500/10';
    case 'available':
    case 'pending':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'reserved':
    case 'overdue':
    case 'failed':
    case 'inactive':
      return 'text-red-500 bg-red-500/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
}
