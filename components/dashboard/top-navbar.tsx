"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { mockNotifications, type UserRole, type User } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  user: User;
  userRole: UserRole;
}

export function TopNavbar({ user, userRole }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-primary/20 text-primary";
      case "employee":
        return "bg-blue-500/20 text-blue-400";
      case "customer":
        return "bg-green-500/20 text-green-400";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0A0F1E]/85 px-4 md:px-6 backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <Image src="/VT-Groups.png" alt="VT Groups Logo" width={40} height={40} className="h-10 w-10 rounded-lg border border-white/10 object-contain" style={{ width: 'auto', height: 'auto' }} />
        <div>
          <p className="text-sm font-semibold text-foreground">VT Groups</p>
          <p className="text-[11px] text-muted-foreground">Luxury Real Estate ERP</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <span>Home</span>
        <span className="select-none">/</span>
        <span className="text-gold font-semibold">{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard</span>
      </div>

      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search lands, customers, payments..."
          className="w-full rounded-xl border border-white/10 bg-[#1f2937] pl-10 text-sm text-foreground backdrop-blur-lg focus:border-gold focus:ring-2 focus:ring-gold/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {mockNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {notification.message}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">{user.name}</span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] capitalize", getRoleBadgeColor(userRole))}
                >
                  {userRole}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
