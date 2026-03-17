"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout userRole="employee" user={user}>
      {children}
    </DashboardLayout>
  );
}

