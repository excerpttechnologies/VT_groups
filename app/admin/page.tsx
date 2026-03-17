"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Map,
  Users,
  UserCog,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const COLORS = ["#3ecf8e", "#3b82f6", "#f59e0b"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/stats", { credentials: 'include' });
        const result = await response.json();

        if (result.success) {
          const stats = {
            totalLands: Object.values(result.data.plots).reduce((a: any, b: any) => a + b, 0),
            availablePlots: result.data.plots.available,
            totalCustomers: result.data.totalCustomers,
            activeCustomers: result.data.totalCustomers, // Placeholder for now
            totalEmployees: result.data.totalEmployees,
            activeEmployees: result.data.totalEmployees, // Placeholder
            totalRevenue: result.data.totalRevenue,
            monthlyRevenue: result.data.monthlyRevenue,
            recentPayments: result.data.recentPayments,
            landStatusDistribution: [
              { name: "Sold", value: result.data.plots.sold },
              { name: "Available", value: result.data.plots.available },
              { name: "Booked", value: result.data.plots.booked },
            ],
            monthlyCollections: [
              { month: "Current", amount: result.data.monthlyRevenue },
            ]
          };
          setData(stats);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  if (!data) return <div>Failed to load data</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Lands"
          value={data.totalLands}
          subtitle={`${data.availablePlots} available`}
          icon={Map}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value={data.totalCustomers}
          subtitle={`${data.activeCustomers} active`}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Employees"
          value={data.totalEmployees}
          subtitle={`${data.activeEmployees} active`}
          icon={UserCog}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          subtitle="All time"
          icon={IndianRupee}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Collections Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Collections (Sample)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyCollections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Land Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Land Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.landStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.landStatusDistribution.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Pending Payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentPayments.length > 0 ? (
                data.recentPayments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{payment.customerId?.name || "Unknown Customer"}</span>
                      <span className="text-sm text-muted-foreground">
                        Plot {payment.landId?.plotNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-semibold text-primary">
                        {formatCurrency(payment.amount)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs capitalize", getStatusColor(payment.status))}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent payments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <Map className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Available Plots</p>
                    <p className="text-sm text-muted-foreground">
                      {data.availablePlots} plots ready for sale
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-500 border-green-500/30">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Total Staff</p>
                    <p className="text-sm text-muted-foreground">
                      {data.totalEmployees} employees registered
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Manage</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
