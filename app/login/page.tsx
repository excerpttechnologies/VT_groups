"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Lock, Mail, ArrowRight, Shield, Loader2, Users } from "lucide-react";
import type { UserRole } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      await login({ email, password, role });
    } catch (error: any) {
      // login helper in AuthContext already shows toast
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@vtgroups.com');
      setPassword('Admin@123');
    }
    else if (selectedRole === 'employee') {
      setEmail('employee@vtgroups.com');
      setPassword('Emp@123');
    }
    else if (selectedRole === 'customer') {
      setEmail('customer@vtgroups.com');
      setPassword('Cust@123');
    }
    toast.info(`Auto-filled ${selectedRole} credentials. Click Sign In to continue.`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-2 rounded-xl shadow-lg mb-4">
            <Image
              src="/VT-Groups-v2.png"
              alt="VT Groups Logo"
              width={120}
              height={80}
              style={{ width: "auto", height: "auto" }}
              className="h-20 w-auto object-contain"
              priority
            />
          </div>
          <p className="text-muted-foreground text-center">
            AI-Powered Land Distribution & Installment Management
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Login As (Visual Only)</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>

            {/* Quick Access - Demo Only */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-semibold text-center mb-3">
                Quick Demo Access
              </p>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-3 mb-4 text-xs">
                <p className="text-blue-200 mb-2"><strong>Admin:</strong> admin@vtgroups.com / Admin@123</p>
                <p className="text-blue-200 mb-2"><strong>Employee:</strong> employee@vtgroups.com / Emp@123</p>
                <p className="text-blue-200"><strong>Customer:</strong> customer@vtgroups.com / Cust@123</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("admin")}
                  className="text-xs h-9"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("employee")}
                  className="text-xs h-9"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Employee
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("customer")}
                  className="text-xs h-9"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Customer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secured with end-to-end encryption</span>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Developed by{" "}
          <span className="text-primary">Excerpt Technologies Pvt Ltd</span>
        </p>
      </div>
    </div>
  );
}
