"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  Users,
  IndianRupee,
  Calendar,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [lands, setLands] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [landsRes, paymentsRes] = await Promise.all([
          fetch("/api/plots"),
          fetch("/api/payments"),
        ]);
        const landsData = await landsRes.json();
        const paymentsData = await paymentsRes.json();

        const landsArray = Array.isArray(landsData?.data?.plots)
          ? landsData.data.plots
          : Array.isArray(landsData?.data)
          ? landsData.data
          : [];

        const paymentsArray = Array.isArray(paymentsData?.data?.payments)
          ? paymentsData.data.payments
          : Array.isArray(paymentsData?.data)
          ? paymentsData.data
          : [];

        if (landsData.success) setLands(landsArray);
        if (paymentsData.success) setPayments(paymentsArray);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };    fetchData();
  }, []);

  // Filter lands assigned to this employee
  const assignedLands = lands.filter(
    (l) => l.employeeId?._id === (user as any)?._id || l.employeeId === (user as any)?._id
  );

  const totalCollections = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const recentPayments = payments.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {user?.name?.split(" ")[0] || "Employee"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your collection overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assigned Lands"
          value={assignedLands.length}
          subtitle="Active plots"
          icon={Map}
        />
        <StatsCard
          title="Total Lands"
          value={lands.length}
          subtitle="In system"
          icon={Users}
        />
        <StatsCard
          title="Total Collections"
          value={formatCurrency(totalCollections)}
          subtitle="All collected"
          icon={IndianRupee}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Recent Payments"
          value={recentPayments.length}
          subtitle="This period"
          icon={Calendar}
          className="border-l-4 border-l-yellow-500"
        />
      </div>

      {/* Quick Actions and Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/employee/collect">
              <Button className="w-full justify-between" size="lg">
                <span className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  Collect Payment
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/employee/lands">
              <Button
                variant="outline"
                className="w-full justify-between"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  View All Lands
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Recent Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <p>No payments recorded yet.</p>
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "rounded-full p-2",
                          payment.method === "cash"
                            ? "bg-green-500/10"
                            : "bg-blue-500/10"
                        )}
                      >
                        <CreditCard
                          className={cn(
                            "h-5 w-5",
                            payment.method === "cash"
                              ? "text-green-500"
                              : "text-blue-500"
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {payment.customerId?.name || "Unknown"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Plot {payment.landId?.plotNumber || "N/A"} •{" "}
                          {new Date(payment.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          payment.method === "cash"
                            ? "text-green-500 border-green-500/30"
                            : "text-blue-500 border-blue-500/30"
                        )}
                      >
                        {payment.method}
                      </Badge>
                      <span className="font-semibold text-primary">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Lands Overview */}
      {assignedLands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Assigned Lands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {assignedLands.map((land) => (
                <Card key={land._id} className="bg-secondary/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{land.plotNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {land.location}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", getStatusColor(land.status))}
                      >
                        {land.status}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">
                        {land.customerId?.name || "Unassigned"}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Monthly EMI
                        </p>
                        <p className="font-semibold text-primary">
                          {formatCurrency(land.monthlyInstallment)}
                        </p>
                      </div>
                      <Link href="/employee/collect">
                        <Button size="sm">Collect</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
