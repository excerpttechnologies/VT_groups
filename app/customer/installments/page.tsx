"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CustomerInstallmentsPage() {
  const { user } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstallments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/customers/me");
        const result = await res.json();
        if (result.success) setCustomer(result.data.customer);
      } catch (error) {
        toast.error("Failed to fetch installments");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstallments();
  }, []);

  const installments = Array.isArray(customer?.installmentSchedule) ? customer.installmentSchedule : [];
  const plot = customer?.assignedPlot;

  const paidInstallments = installments.filter((i: any) => i.status === "Paid");
  const pendingInstallments = installments.filter(
    (i: any) => i.status === "Pending"
  );
  const overdueInstallments = installments.filter(
    (i: any) => i.status === "Overdue"
  );

  const renderInstallmentTable = (rows: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plot</TableHead>
          <TableHead>Month</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((inst) => (
          <TableRow key={inst._id}>
            <TableCell className="font-medium">
              {plot?.plotNumber || "N/A"}
            </TableCell>
            <TableCell>Month {inst.month}</TableCell>
            <TableCell>
              {new Date(inst.dueDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{formatCurrency(inst.amount)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn("capitalize", getStatusColor(inst.status))}
              >
                {inst.status === "Paid" && (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                {inst.status === "Pending" && (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {inst.status === "Overdue" && (
                  <AlertTriangle className="mr-1 h-3 w-3" />
                )}
                {inst.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading installments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Installments</h1>
        <p className="text-muted-foreground">
          Track all your installment payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">{paidInstallments.length}</p>
                <p className="text-sm text-green-500">
                  {formatCurrency(
                    paidInstallments.reduce((sum: number, i: any) => sum + (i.amount || 0), 0)
                  )}
                </p>

              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-500/10 p-3">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {pendingInstallments.length}
                </p>
                <p className="text-sm text-yellow-500">
                  {formatCurrency(
                    pendingInstallments.reduce((sum: number, i: any) => sum + (i.amount || 0), 0)
                  )}
                </p>

              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-500/10 p-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">
                  {overdueInstallments.length}
                </p>
                <p className="text-sm text-red-500">
                  {formatCurrency(
                    overdueInstallments.reduce((sum: number, i: any) => sum + (i.amount || 0), 0)
                  )}
                </p>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installments Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Installment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All ({installments.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingInstallments.length})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue ({overdueInstallments.length})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Paid ({paidInstallments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {installments.length > 0 ? (
                renderInstallmentTable(installments)
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No installments found
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {pendingInstallments.length > 0 ? (
                renderInstallmentTable(pendingInstallments)
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  No pending installments!
                </div>
              )}
            </TabsContent>

            <TabsContent value="overdue">
              {overdueInstallments.length > 0 ? (
                renderInstallmentTable(overdueInstallments)
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  No overdue installments!
                </div>
              )}
            </TabsContent>

            <TabsContent value="paid">
              {paidInstallments.length > 0 ? (
                renderInstallmentTable(paidInstallments)
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No paid installments yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
