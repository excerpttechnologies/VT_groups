"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/AuthContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout userRole="customer" user={user}>
      {children}
    </DashboardLayout>
  );
}

