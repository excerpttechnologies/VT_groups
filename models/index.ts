// Models index - Import ALL models here to ensure they are registered in Mongoose
// This prevents "MissingSchemaError: Schema hasn't been registered for model" errors

import User from './User';
import Plot from './Plot';
import Customer from './Customer';
import Payment from './Payment';
import Installment from './Installment';
import Land from './Land';
import Notification from './Notification';
import ActivityLog from './ActivityLog';
import Settings from './Settings';
import SupportTicket from './SupportTicket';

// Export models for convenience
export {
  User,
  Plot,
  Customer,
  Payment,
  Installment,
  Land,
  Notification,
  ActivityLog,
  Settings,
  SupportTicket,
};
