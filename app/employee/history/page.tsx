"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Calendar, User, Search, Loader2, IndianRupee } from "lucide-react";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EmployeeHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/payments");
        const result = await res.json();
        if (result.success) {
          setPayments(result.data);
        }
      } catch (error) {
        toast.error("Failed to load collection history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const paymentsArray = Array.isArray(payments) 
    ? payments 
    : (payments as any)?.payments || (payments as any)?.data || [];

  const filteredPayments = paymentsArray.filter((payment: any) => 
    payment.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.landId?.plotNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = filteredPayments
    .filter((p: any) => p.status === "Completed")
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading collection history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Collection History</h1>
          <p className="text-muted-foreground">
            Track all payments and collections managed by you
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by customer or plot..." 
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-gold/10 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <IndianRupee className="h-24 w-24" />
        </div>
        <CardContent className="pt-6 relative z-10">
          <div className="grid gap-6 md:grid-cols-3 items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Collected</p>
              <h3 className="text-4xl font-bold text-primary mt-1">{formatCurrency(totalCollected)}</h3>
            </div>
            <div className="h-12 w-px bg-border/50 hidden md:block" />
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Payments</p>
              <h3 className="text-2xl font-bold mt-1">{filteredPayments.length}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-primary/5 border-b border-white/5">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Collections
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/5 bg-white/5">
                  <TableHead className="font-bold py-4">Date</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Plot #</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Method</TableHead>
                  <TableHead className="font-bold text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment: any) => (
                  <TableRow key={payment._id} className="hover:bg-white/5 border-white/5 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{formatDate(payment.createdAt)}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {payment.customerId?.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{payment.customerId?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white/5 font-mono text-xs">
                        {payment.landId?.plotNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">{formatCurrency(payment.amount)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground flex items-center gap-2 capitalise">
                        {payment.paymentMethod === 'Cash' ? (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                        {payment.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={cn("capitalize px-4 py-1", getStatusColor(payment.status))}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredPayments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-20 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">No Collections Recorded</h3>
            <p className="text-muted-foreground mt-1">
              You haven&apos;t recorded any collections matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
