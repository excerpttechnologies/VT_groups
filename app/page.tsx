"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Map,
  Users,
  CreditCard,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Lock,
  Smartphone,
  Clock,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const features = [
  {
    icon: Map,
    title: "Land Management",
    description:
      "Comprehensive plot tracking with size, location, pricing, and installment details.",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description:
      "Self-service dashboard for customers to track payments and land details.",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description:
      "Real-time installment tracking with cash and online payment support.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Detailed collection reports, payment history, and business insights.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Secure admin, employee, and customer roles with encrypted credentials.",
  },
  {
    icon: Cloud,
    title: "Cloud-Based",
    description:
      "Access your data anywhere with our secure cloud infrastructure.",
  },
];

const stats = [
  { label: "Plots Managed", value: "500+" },
  { label: "Active Customers", value: "1,200+" },
  { label: "Collections (Monthly)", value: "₹50L+" },
  { label: "Uptime", value: "99.9%" },
];

export default function LandingPage() {
  const { login } = useAuth();
  const [demoRole, setDemoRole] = useState<string | null>(null);

  const handleDemoLogin = async (role: 'admin' | 'employee' | 'customer') => {
    setDemoRole(role);
    const credentials = {
      admin: { email: 'admin@vtgroups.com', password: 'Admin@123' },
      employee: { email: 'employee@vtgroups.com', password: 'Emp@123' },
      customer: { email: 'customer@vtgroups.com', password: 'Cust@123' }
    }[role];

    try {
      await login(credentials);
    } catch (error) {
      console.error('Demo login failed');
    } finally {
      setDemoRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-md">
              <Image
                src="/VT-Groups.png"
                alt="VT Groups Logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-4" variant="outline">
            AI-Powered Land Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Land Distribution &<br />
            <span className="text-primary">Installment Management</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Streamline your land sales with our comprehensive management system.
            Track plots, manage customers, and monitor installments all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-lg px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 text-lg px-8"
              onClick={() => handleDemoLogin('admin')}
              disabled={!!demoRole}
            >
              {demoRole === 'admin' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'View Demo'}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Land Sales
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to
              streamline your land distribution business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card hover:bg-secondary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Panels Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              User Panels
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dedicated Dashboards for Every Role
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Panel */}
            <Card className="overflow-hidden">
              <div className="bg-primary/10 p-6 border-b border-border">
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  Admin
                </Badge>
                <h3 className="text-2xl font-bold">Admin Panel</h3>
                <p className="text-muted-foreground">Full system control</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {[
                    "Manage all land plots",
                    "Create employee accounts",
                    "Track all payments",
                    "Generate reports",
                    "System configuration",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={!!demoRole}
                >
                  {demoRole === 'admin' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View Admin Demo'}
                </Button>
              </CardContent>
            </Card>

            {/* Employee Panel */}
            <Card className="overflow-hidden">
              <div className="bg-blue-500/10 p-6 border-b border-border">
                <Badge className="mb-2 bg-blue-500 text-white">Employee</Badge>
                <h3 className="text-2xl font-bold">Employee Panel</h3>
                <p className="text-muted-foreground">Collection management</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {[
                    "View assigned lands",
                    "Manage customers",
                    "Collect payments",
                    "Update payment status",
                    "Raise support queries",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => handleDemoLogin('employee')}
                  disabled={!!demoRole}
                >
                  {demoRole === 'employee' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View Employee Demo'}
                </Button>
              </CardContent>
            </Card>

            {/* Customer Panel */}
            <Card className="overflow-hidden">
              <div className="bg-green-500/10 p-6 border-b border-border">
                <Badge className="mb-2 bg-green-500 text-white">Customer</Badge>
                <h3 className="text-2xl font-bold">Customer Panel</h3>
                <p className="text-muted-foreground">Self-service portal</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {[
                    "View land details",
                    "Track installments",
                    "Payment history",
                    "Receive notifications",
                    "Payment reminders",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => handleDemoLogin('customer')}
                  disabled={!!demoRole}
                >
                  {demoRole === 'customer' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View Customer Demo'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                Security
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-muted-foreground mb-8">
                Your data is protected with industry-leading security measures.
                We take security seriously so you can focus on your business.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Encrypted Data</h4>
                    <p className="text-sm text-muted-foreground">
                      End-to-end encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Role-Based Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Secure permissions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cloud className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Cloud Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic backups
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Activity Logs</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete audit trail
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-secondary/50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Smartphone className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Access Anywhere</h4>
                      <p className="text-muted-foreground">
                        Mobile-friendly design
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Access your dashboard from any device. Our responsive design
                    ensures a seamless experience on desktop, tablet, and mobile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Land Business?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join hundreds of land distributors who trust VT Groups for their
            business management needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-lg px-8">
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 text-lg px-8"
              onClick={() => handleDemoLogin('admin')}
              disabled={!!demoRole}
            >
              {demoRole === 'admin' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Explore Demo'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-sm">
                <Image src="/VT-Groups.png" alt="VT Groups Logo" width={32} height={32} className="h-8 w-auto object-contain" />
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
