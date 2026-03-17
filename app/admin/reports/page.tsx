"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  FileText,
  Download,
  TrendingUp,
  IndianRupee,
  Users,
  Map,
  Calendar,
  Loader2,
} from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";
import { formatCurrency } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/stats");
        const result = await res.json();
        if (result.success) {
          const data = result.data;
          setStats({
            totalRevenue: data.totalRevenue,
            monthlyRevenue: data.monthlyRevenue,
            totalCustomers: data.totalCustomers,
            soldPlots: data.plots.sold,
            totalPlots: data.plots.available + data.plots.booked + data.plots.sold,
            landStatusDistribution: [
              { name: "Sold", value: data.plots.sold },
              { name: "Available", value: data.plots.available },
              { name: "Booked", value: data.plots.booked },
            ],
            pendingPayments: 0 // Default for now
          });
        } else {
          toast.error(result.message || "Failed to fetch stats");
        }
      } catch (error) {
        toast.error("Error loading reports data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  // Fallback / mock data for charts not yet provided by API
  const monthlyData = [
    { month: "Jan", collections: 270000 },
    { month: "Feb", collections: 310000 },
    { month: "Mar", collections: 250000 },
    { month: "Apr", collections: 180000 },
    { month: "May", collections: 220000 },
    { month: "Jun", collections: 295000 },
  ];

  const landStatusData = stats?.landStatusDistribution?.map((item: any) => ({
    ...item,
    color: item.name === "Sold" ? "#3ecf8e" : item.name === "Available" ? "#3b82f6" : "#f59e0b",
  })) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Business analytics and performance reports
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={IndianRupee}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Lands Sold"
          value={stats?.soldPlots || 0}
          subtitle="Total plots"
          icon={Map}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          subtitle="Active in system"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Payments"
          value={formatCurrency(stats?.pendingPayments || 0)}
          subtitle="Outstanding balance"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trend (Simulation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
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
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="collections"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Land Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={landStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {landStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Download Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Collection Report", description: "Monthly payment collections" },
              { name: "Customer Report", description: "Customer payment history" },
              { name: "Land Sales Report", description: "Plot sales summary" },
              { name: "Employee Performance", description: "Collection by employee" },
            ].map((report) => (
              <Card key={report.name} className="bg-secondary/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold">{report.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => toast.success(`Preparing ${report.name}...`)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
