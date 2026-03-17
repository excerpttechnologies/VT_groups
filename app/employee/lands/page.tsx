"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Map, Phone, Mail, CreditCard, Loader2 } from "lucide-react";
import {
  formatCurrency,
  getStatusColor,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EmployeeLandsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/employee/plots");
        const result = await res.json();
        if (result.success) {
          setAssignments(result.data);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
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
        <p className="text-muted-foreground">Loading assigned lands...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assigned Lands</h1>
        <p className="text-muted-foreground">
          View and manage your assigned land plots
        </p>
      </div>

      {/* Land Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {assignments.map((assignment) => {
          const land = assignment.assignedPlot;
          const userDoc = assignment.userId;
          
          const totalPaid = assignment.totalPaid || 0;
          const totalAmount = assignment.totalAmount || 0;
          const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;
          
          const pendingInstallments = assignment.installmentSchedule?.filter(
            (i: any) => i.status === "Pending" || i.status === "Overdue"
          ) || [];

          if (!land) return null;

          return (
            <Card key={assignment._id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      {land.plotNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
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
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Customer Info */}
                {userDoc && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Customer Information
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{userDoc.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {userDoc.phone || "N/A"}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {userDoc.email || "N/A"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Land Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Area</p>
                    <p className="font-semibold">{land.area} {land.areaUnit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Price</p>
                    <p className="font-semibold">
                      {formatCurrency(land.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly EMI</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(assignment.installmentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending</p>
                    <p className="font-semibold text-yellow-500">
                      {pendingInstallments.length} installments
                    </p>
                  </div>
                </div>

                {/* Payment Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Payment Progress
                    </span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Paid: {formatCurrency(totalPaid)}</span>
                    <span>
                      Remaining:{" "}
                      {formatCurrency(Math.max(0, totalAmount - totalPaid))}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href="/employee/collect" className="flex-1">
                    <Button className="w-full gap-2">
                      <CreditCard className="h-4 w-4" />
                      Collect Payment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Map className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Assigned Lands</h3>
            <p className="text-muted-foreground">
              You don&apos;t have any lands assigned to you yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
