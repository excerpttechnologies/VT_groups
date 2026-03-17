"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Map,
  IndianRupee,
  Calendar,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
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

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/customers/me", { credentials: 'include' });
        const result = await res.json();
        if (result.success) {
          setCustomer(result.data.customer);
          setPayments(result.data.payments);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPaid = customer?.paidAmount || 0;
  const totalAmount = customer?.totalAmount || 0;
  const pendingBalance = totalAmount - totalPaid;
  const overallProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const recentPayments = payments.slice(0, 3);

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
          Welcome, {user?.name?.split(" ")[0] || "Customer"}!
        </h1>
        <p className="text-muted-foreground">
          Track your land purchases and installment payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="My Lands"
          value={customer?.assignedPlot ? 1 : 0}
          subtitle="Total plots owned"
          icon={Map}
        />
        <StatsCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          subtitle="Amount cleared"
          icon={IndianRupee}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Pending Balance"
          value={formatCurrency(Math.max(0, pendingBalance))}
          subtitle="Amount remaining"
          icon={Clock}
          className="border-l-4 border-l-yellow-500"
        />
        <StatsCard
          title="Total Properties"
          value={customer?.assignedPlot ? 1 : 0}
          subtitle={`${customer?.status === 'Active' ? 1 : 0} active`}
          icon={Calendar}
        />
      </div>


      {/* Overall Progress */}
      {totalAmount > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Payment Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your plot {customer?.assignedPlot?.plotNumber}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {overallProgress.toFixed(0)}%
                </span>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>

            </div>
            <Progress value={overallProgress} className="h-4 mt-4" />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-muted-foreground">
                Paid: {formatCurrency(totalPaid)}
              </span>
              <span className="text-muted-foreground">
                Remaining: {formatCurrency(Math.max(0, pendingBalance))}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Lands */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              My Land Plots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!customer?.assignedPlot ? (
              <p className="text-center text-muted-foreground py-6">
                No land plots assigned yet.
              </p>
            ) : (
                <div
                  key={customer.assignedPlot._id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{customer.assignedPlot.plotNumber}</h4>
                      <p className="text-sm text-muted-foreground">
                        {customer.assignedPlot.location}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", getStatusColor(customer.assignedPlot.status))}
                    >
                      {customer.assignedPlot.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size: </span>
                      <span>{customer.assignedPlot.area} {customer.assignedPlot.areaUnit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">EMI: </span>
                      <span className="text-primary font-medium">
                        {formatCurrency(customer.installmentAmount)}
                      </span>
                    </div>
                  </div>
                </div>
            )}

            <Link href="/customer/lands">
              <Button variant="outline" className="w-full mt-2">
                View All Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No payments recorded yet.
              </p>
            ) : (
              recentPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
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
                          "h-4 w-4",
                          payment.method === "cash"
                            ? "text-green-500"
                            : "text-blue-500"
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {payment.landId?.plotNumber || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              ))
            )}
            <Link href="/customer/payments">
              <Button variant="outline" className="w-full mt-2">
                View Payment History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
