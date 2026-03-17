"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import type { UserRole, User } from "@/lib/mock-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  user: any;
}


export function DashboardLayout({ children, userRole, user }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole={userRole} collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          collapsed ? 'pl-[72px]' : 'pl-[260px]'
        )}
      >
        <TopNavbar user={user} userRole={userRole} />
        <main className="flex-1 p-6 lg:p-8 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
