import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const EMAIL_FROM = process.env.EMAIL_FROM || '"VT Groups" <noreply@vtgroups.com>';

export async function sendWelcomeEmail(user: any, tempPassword?: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #2563eb;">Welcome to VT Groups!</h2>
      <p>Hello ${user.name},</p>
      <p>Your account has been created successfully.</p>
      ${tempPassword ? `<p>Your temporary password is: <strong>${tempPassword}</strong></p><p>Please change your password after logging in.</p>` : ''}
      <p>You can login at: <a href="${process.env.NEXT_PUBLIC_API_URL}/login">${process.env.NEXT_PUBLIC_API_URL}/login</a></p>
      <p>Best regards,<br/>VT Groups Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Welcome to VT Groups',
    html,
  });
}

export async function sendPaymentConfirmation(user: any, payment: any, customer: any) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #10b981;">Payment Received</h2>
      <p>Hello ${user.name},</p>
      <p>We have received your payment of <strong>₹${payment.amount}</strong> for installment #${payment.installmentNumber}.</p>
      <p>Receipt Number: ${payment.receiptNumber}</p>
      <p>Date: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
      <p>Thank you for your business!</p>
      <p>Best regards,<br/>VT Groups Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: `Payment Confirmation - ${payment.receiptNumber}`,
    html,
  });
}

export async function sendInstallmentReminder(user: any, installment: any) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #f59e0b;">Upcoming Installment Reminder</h2>
      <p>Hello ${user.name},</p>
      <p>This is a reminder that your installment for the current month is due on <strong>${new Date(installment.dueDate).toLocaleDateString()}</strong>.</p>
      <p>Amount: <strong>₹${installment.amount}</strong></p>
      <p>Please ensure timely payment to avoid late fees.</p>
      <p>Best regards,<br/>VT Groups Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Installment Due Reminder - VT Groups',
    html,
  });
}

export async function sendPasswordResetEmail(user: any, resetLink: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br/>VT Groups Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Password Reset Request - VT Groups',
    html,
  });
}
