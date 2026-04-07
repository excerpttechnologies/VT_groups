"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Phone, Mail, MapPin, Search, Loader2, MessageSquare } from "lucide-react";
import { getStatusColor } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

export default function EmployeeCustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/employee/plots");
        const result = await res.json();
        if (result.success) {
          // Extract unique customers from assigned plots
          const uniqueCustomers: any[] = [];
          const customerIds = new Set();
          
          result.data.forEach((assignment: any) => {
            if (assignment.userId && !customerIds.has(assignment.userId._id)) {
              customerIds.add(assignment.userId._id);
              uniqueCustomers.push({
                ...assignment.userId,
                plotNumber: assignment.assignedPlot?.plotNumber,
                location: assignment.assignedPlot?.location
              });
            }
          });
          
          setCustomers(uniqueCustomers);
        }
      } catch (error) {
        toast.error("Failed to load customer data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your customers...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Your Customers</h1>
          <p className="text-muted-foreground">
            Manage and communicate with your assigned plot owners
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h3 className="text-2xl font-bold">{customers.length}</h3>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer._id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-white/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {customer.name?.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{customer.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wider">
                      Customer ID: {customer._id.substring(customer._id.length - 6)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone || "No phone added"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Plot: <span className="text-foreground font-medium">{customer.plotNumber}</span> ({customer.location})
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 gap-2" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Link href={`tel:${customer.phone}`} className="flex-1">
                  <Button className="w-full gap-2" variant="secondary">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-20 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">No Customers Found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? `No matches for "${searchTerm}"` : "You don't have any customers assigned to your plots yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
