export interface InstallmentScheduleItem {
  month: number;
  dueDate: Date;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Waived';
}

export function generateInstallmentSchedule({
  totalAmount,
  downPayment,
  installmentMonths,
  startDate = new Date(),
}: {
  totalAmount: number;
  downPayment: number;
  installmentMonths: number;
  startDate?: Date;
}): InstallmentScheduleItem[] {
  const remainingAmount = totalAmount - downPayment;
  const installmentAmount = Math.ceil(remainingAmount / installmentMonths);
  const schedule: InstallmentScheduleItem[] = [];

  for (let i = 1; i <= installmentMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    
    schedule.push({
      month: i,
      dueDate,
      amount: installmentAmount,
      status: 'Pending',
    });
  }

  return schedule;
}
