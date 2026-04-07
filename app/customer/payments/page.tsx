"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Banknote, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CustomerPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/customers/me");
        const result = await res.json();
        if (result.success) setPayments(result.data.payments);
      } catch (error) {
        toast.error("Failed to fetch payments");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const paymentsArray = Array.isArray(payments) ? payments : [];
  const completedPayments = paymentsArray.filter((p) => p.status === "Completed" || p.status === "Paid");
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const cashPayments = completedPayments.filter((p) => p.paymentMode === "Cash");
  const onlinePayments = completedPayments.filter((p) => p.paymentMode === "Online");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground">
          View all your completed payment transactions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(totalPaid)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {completedPayments.length} transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <Banknote className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cash Payments</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    cashPayments.reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cashPayments.length} transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Smartphone className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Online Payments</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    onlinePayments.reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {onlinePayments.length} transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">
                      {payment.plotId?.plotNumber || "N/A"}
                    </TableCell>
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
                        {payment.paymentMode === "Cash" ? (
                          <Banknote className="mr-1 h-3 w-3" />
                        ) : (
                          <Smartphone className="mr-1 h-3 w-3" />
                        )}
                        {payment.paymentMode}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.collectedBy?.name || "Self / Online"}</TableCell>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          getStatusColor(payment.status)
                        )}
                      >
                        {payment.status === "Completed" && (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <CreditCard className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold">No Payments Yet</h3>
              <p>You haven&apos;t made any payments yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
