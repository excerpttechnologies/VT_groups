"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout userRole="admin" user={user}>
      {children}
    </DashboardLayout>
  );
}

