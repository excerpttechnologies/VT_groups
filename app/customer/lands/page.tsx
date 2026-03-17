"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Map, Calendar, IndianRupee, FileText, Loader2 } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CustomerLandsPage() {
  const { user } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/customers/me");
        const result = await res.json();
        if (result.success) {
          setCustomer(result.data.customer);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your lands...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Land Plots</h1>
        <p className="text-muted-foreground">
          Detailed view of all your land purchases
        </p>
      </div>

      {!customer?.assignedPlot ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Map className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Land Purchases</h3>
            <p className="text-muted-foreground">
              You haven&apos;t purchased any land yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        (() => {
          const land = customer.assignedPlot;
          const landInstallments = customer.installmentSchedule || [];
          const totalPaid = customer.totalPaid || 0;
          const totalAmount = customer.totalAmount || 0;
          const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

          return (
            <Card key={land._id}>
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Map className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{land.plotNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {land.location}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize text-sm px-4 py-1",
                      getStatusColor(land.status)
                    )}
                  >
                    {land.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Land Size
                    </p>
                    <p className="font-semibold text-lg">{land.area} {land.areaUnit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      Total Price
                    </p>
                    <p className="font-semibold text-lg">
                      {formatCurrency(land.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Purchase Date
                    </p>
                    <p className="font-semibold text-lg">
                      {customer.startDate
                        ? new Date(customer.startDate).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      Monthly EMI
                    </p>
                    <p className="font-semibold text-lg text-primary">
                      {formatCurrency(customer.installmentAmount)}
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Payment Progress</h4>
                      <p className="text-sm text-muted-foreground">
                        {customer.paidInstallments} of {customer.installmentMonths}{" "}
                        months completed
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Paid: </span>
                      <span className="font-semibold text-green-500">
                        {formatCurrency(totalPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining: </span>
                      <span className="font-semibold text-yellow-500">
                        {formatCurrency(
                          Math.max(0, totalAmount - totalPaid)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {landInstallments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Installment Schedule</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {landInstallments.map((inst: any) => (
                          <TableRow key={inst._id}>
                            <TableCell className="font-medium">
                              Month {inst.month}
                            </TableCell>
                            <TableCell>
                              {new Date(inst.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{formatCurrency(inst.amount)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "capitalize",
                                  getStatusColor(inst.status)
                                )}
                              >
                                {inst.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {land.description && (
                  <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{land.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()
      )}

    </div>
  );
}
