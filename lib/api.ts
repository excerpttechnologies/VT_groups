import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;

// Auth
export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const changePassword = (data: any) => api.put('/auth/change-password', data);
export const forgotPassword = (data: any) => api.post('/auth/forgot-password', data);
export const resetPassword = (data: any) => api.post('/auth/reset-password', data);

// Admin Stats
export const getAdminStats = () => api.get('/admin/stats');

// Employees
export const getEmployees = (params?: any) => api.get('/admin/employees', { params });
export const createEmployee = (data: any) => api.post('/admin/employees', data);
export const updateEmployee = (id: string, data: any) => api.put(`/admin/employees/${id}`, data);
export const deleteEmployee = (id: string) => api.delete(`/admin/employees/${id}`);
export const getEmployeeReport = (id: string) => api.get(`/admin/employees/${id}/report`);

// Plots
export const getPlots = (params?: any) => api.get('/plots', { params });
export const createPlot = (data: any) => api.post('/plots', data);
export const updatePlot = (id: string, data: any) => api.put(`/plots/${id}`, data);
export const deletePlot = (id: string) => api.delete(`/plots/${id}`);

// Customers
export const getCustomers = (params?: any) => api.get('/customers', { params });
export const createCustomer = (data: any) => api.post('/customers', data);
export const getCustomer = (id: string) => api.get(`/customers/${id}`);
export const updateCustomer = (id: string, data: any) => api.put(`/customers/${id}`, data);
export const getInstallmentSchedule = (id: string) => api.get(`/customers/${id}/installment-schedule`);

// Payments
export const getPayments = (params?: any) => api.get('/payments', { params });
export const createPayment = (data: any) => api.post('/payments', data);
export const updatePaymentStatus = (id: string, status: string) => api.put(`/payments/${id}/status`, { status });
export const downloadReceipt = (id: string) => api.get(`/payments/receipt/${id}`, { responseType: 'blob' });

// Reports
export const getCollectionReport = (params?: any) => api.get('/reports/collection', { params });
export const getDefaulters = () => api.get('/reports/defaulters');
export const exportReport = (type: string, params?: any) => api.get(`/reports/export`, { params: { type, ...params }, responseType: 'blob' });

// Customer Dashboard
export const getMyDashboard = () => api.get('/customer/dashboard');
export const getMyLand = () => api.get('/customer/land');
export const getMyInstallments = () => api.get('/customer/installments');

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id: string) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');

// Support
export const raiseTicket = (data: any) => api.post('/support', data);
export const getTickets = () => api.get('/support');
export const replyTicket = (id: string, reply: string) => api.put(`/support/${id}/reply`, { reply });

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data: any) => api.put('/settings', data);

// Logs
export const getLogs = (params?: any) => api.get('/logs', { params });
