"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/payments");
      const result = await res.json();
      if (result.success) {
        setPayments(result.data.payments);
      }
    } catch (error) {
      toast.error("Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const customerName = payment.customerId?.userId?.name || "";
    const matchesSearch = customerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" || payment.paymentMode === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    totalCollected: payments
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: 0, // Not applicable for recorded payments
    cashTotal: payments
        .filter((p) => p.paymentMode === "Cash" && p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0),
    onlineTotal: payments
        .filter((p) => p.paymentMode === "Online" && p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage all payment transactions
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Collected"
          value={formatCurrency(stats.totalCollected)}
          icon={IndianRupee}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending"
          value={formatCurrency(stats.pendingAmount)}
          icon={Clock}
          className="border-l-4 border-l-yellow-500"
        />
        <StatsCard
          title="Cash Payments"
          value={formatCurrency(stats.cashTotal)}
          icon={CreditCard}
        />
        <StatsCard
          title="Online Payments"
          value={formatCurrency(stats.onlineTotal)}
          icon={TrendingUp}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[150px]">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Transactions ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plot</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Collected By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                        <TableCell className="font-medium">
                        {payment.customerId?.userId?.name || "Unknown"}
                        </TableCell>
                        <TableCell>{payment.plotId?.plotNumber || "N/A"}</TableCell>
                        <TableCell className="font-semibold text-primary">
                        {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                        <Badge
                            variant="outline"
                            className={cn(
                            "capitalize",
                            payment.paymentMode === "Cash"
                                ? "text-green-500 border-green-500/30"
                                : "text-blue-500 border-blue-500/30"
                            )}
                        >
                            {payment.paymentMode}
                        </Badge>
                        </TableCell>
                        <TableCell>{payment.collectedBy?.name || "N/A"}</TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <Badge
                            variant="outline"
                            className={cn(
                            "capitalize",
                            getStatusColor(payment.status)
                            )}
                        >
                            {payment.status === "Paid" && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            )}
                            {payment.status}
                        </Badge>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
