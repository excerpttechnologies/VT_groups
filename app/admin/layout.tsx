"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import ErrorBoundary from "@/components/error-boundary";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login...");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // If no user but not loading anymore, don't render
  if (!user) {
    return null;
  }

  return (
    <ErrorBoundary>
      <DashboardLayout userRole="admin" user={user}>
        {children}
      </DashboardLayout>
    </ErrorBoundary>
  );
}

