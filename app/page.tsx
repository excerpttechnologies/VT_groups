"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { UserPanelsCarousel } from "@/components/landing/user-panels-carousel";
import { SecuritySection } from "@/components/landing/security-section";
import { CTASection } from "@/components/landing/cta-section";
import {
  Map,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Cloud,
  ArrowRight,
  Loader2
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Land Management",
    description: "Comprehensive plot tracking with size, location, pricing, and installment details.",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Self-service dashboard for customers to track payments and land details.",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description: "Real-time installment tracking with cash and online payment support.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Detailed collection reports, payment history, and business insights.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure admin, employee, and customer roles with encrypted credentials.",
  },
  {
    icon: Cloud,
    title: "Cloud-Based",
    description: "Access your data anywhere with our secure cloud infrastructure.",
  },
];

const stats = [
  { label: "Plots Managed", value: "500+", prefix: "" },
  { label: "Active Customers", value: "1,200+", prefix: "" },
  { label: "Collections (Monthly)", value: "50+", prefix: "₹" },
  { label: "Uptime", value: "99.9%", prefix: "" },
];

const panels = [
  {
    id: "admin",
    title: "Admin Panel",
    subtitle: "Full system control",
    badgeLabel: "Admin",
    badgeColor: "bg-primary text-primary-foreground",
    description: "Complete control over all system features and user management.",
    gradient: "bg-gradient-to-br from-primary/20 to-primary/10",
    textColor: "text-primary",
    features: [
      { item: "Manage all land plots" },
      { item: "Create employee accounts" },
      { item: "Track all payments" },
      { item: "Generate reports" },
      { item: "System configuration" },
    ],
  },
  {
    id: "employee",
    title: "Employee Panel",
    subtitle: "Collection management",
    badgeLabel: "Employee",
    badgeColor: "bg-blue-500 text-white",
    description: "Manage collections, customers, and payment tracking.",
    gradient: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
    textColor: "text-blue-500",
    features: [
      { item: "View assigned lands" },
      { item: "Manage customers" },
      { item: "Collect payments" },
      { item: "Update payment status" },
      { item: "Raise support queries" },
    ],
  },
  {
    id: "customer",
    title: "Customer Panel",
    subtitle: "Self-service portal",
    badgeLabel: "Customer",
    badgeColor: "bg-green-500 text-white",
    description: "Track your land details and installment payments.",
    gradient: "bg-gradient-to-br from-green-500/20 to-green-500/10",
    textColor: "text-green-500",
    features: [
      { item: "View land details" },
      { item: "Track installments" },
      { item: "Payment history" },
      { item: "Receive notifications" },
      { item: "Payment reminders" },
    ],
  },
];

export default function LandingPage() {
  const { login } = useAuth();
  const [demoRole, setDemoRole] = useState<string | null>(null);

  const handleDemoLogin = async (panelId: string) => {
    const roleMap: { [key: string]: 'admin' | 'employee' | 'customer' } = {
      admin: 'admin',
      employee: 'employee',
      customer: 'customer',
    };
    
    const role = roleMap[panelId];
    if (!role) return;

    setDemoRole(panelId);
    const credentials = {
      admin: { email: 'admin@vtgroups.com', password: 'Admin@123' },
      employee: { email: 'employee@vtgroups.com', password: 'Emp@123' },
      customer: { email: 'customer@vtgroups.com', password: 'Cust@123' }
    }[role];

    try {
      await login({ ...credentials, role });
    } catch (error) {
      console.error('Demo login failed');
    } finally {
      setDemoRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-md" style={{ width: 'auto', height: '40px' }}>
              <Image
                src="/VT-Groups.png"
                alt="VT Groups Logo"
                width={120}
                height={40}
                className="h-full w-auto object-contain"
                priority
                style={{ width: 'auto', height: '100%' }}
              />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 rounded-lg bg-primary text-[#0d0d10] font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* User Panels Carousel */}
      <UserPanelsCarousel 
        panels={panels}
        onDemoClick={handleDemoLogin}
        isLoading={!!demoRole}
      />

      {/* Security Section */}
      <SecuritySection />

      {/* CTA Section */}
      <CTASection onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-sm" style={{ width: 'auto', height: '32px' }}>
                <Image
                  src="/VT-Groups.png"
                  alt="VT Groups Logo"
                  width={32}
                  height={32}
                  className="h-full w-auto object-contain"
                  style={{ width: 'auto', height: '100%' }}
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Developed by{" "}
              <span className="text-primary font-medium">
                Excerpt Technologies Pvt Ltd
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 VT Groups. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
