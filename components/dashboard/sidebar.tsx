"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Map,
  Users,
  UserCog,
  CreditCard,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Receipt,
  Bell,
  LogOut,
} from "lucide-react";
import type { UserRole } from "@/lib/mock-data";

interface SidebarProps {
  userRole: UserRole;
  collapsed: boolean;
  onToggle: () => void;
}

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Lands", href: "/admin/lands", icon: Map },
  { title: "Employees", href: "/admin/employees", icon: UserCog },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const employeeNavItems = [
  { title: "Dashboard", href: "/employee", icon: LayoutDashboard },
  { title: "Assigned Lands", href: "/employee/lands", icon: Map },
  { title: "Customers", href: "/employee/customers", icon: Users },
  { title: "Collect Payment", href: "/employee/collect", icon: CreditCard },
  { title: "Payment History", href: "/employee/history", icon: Receipt },
  { title: "Support", href: "/employee/support", icon: HelpCircle },
];

const customerNavItems = [
  { title: "Dashboard", href: "/customer", icon: LayoutDashboard },
  { title: "My Lands", href: "/customer/lands", icon: Map },
  { title: "Installments", href: "/customer/installments", icon: Receipt },
  { title: "Payment History", href: "/customer/payments", icon: CreditCard },
  { title: "Notifications", href: "/customer/notifications", icon: Bell },
  { title: "Support", href: "/customer/support", icon: HelpCircle },
];

export function Sidebar({ userRole, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems =
    userRole === "admin"
      ? adminNavItems
      : userRole === "employee"
        ? employeeNavItems
        : customerNavItems;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-18" : "w-[260px]"
      )}
      style={{ width: collapsed ? 72 : 260 }}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 flex-col justify-center border-b border-sidebar-border px-4 pt-2 pb-2">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2">
              <Image src="/VT-Groups.png" alt="VT Groups Logo" width={48} height={48} className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">
                  VT Groups
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Land Management
                </span>
              </div>
            </Link>
          ) : (
            <Image src="/VT-Groups.png" alt="Logo" width={32} height={32} className="mx-auto h-8 w-8 object-contain" />
          )}
          {!collapsed && <div className="mt-2 h-px w-full bg-gradient-to-r from-gold via-gold/40 to-transparent" />}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== `/${userRole}` &&
                  pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 rounded-lg px-4 py-2 text-left transition-all duration-200 ease-out slide-bar",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-primary/20 text-gold"
                        : "text-muted-foreground hover:bg-white/10 hover:text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-current" />
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 rounded-lg px-3 py-2 text-left text-muted-foreground transition-all hover:bg-white/10 hover:text-destructive",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </Button>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-8 w-8 rounded-full border border-sidebar-border bg-[#0A0F1E] text-gold shadow-lg hover:bg-white/10"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
