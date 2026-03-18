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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Map,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
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

export default function LandsPage() {
  const { user } = useAuth();
  const [lands, setLands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    plotNumber: "",
    area: 0,
    areaUnit: "sqft",
    location: "",
    totalPrice: 0,
    plotType: "Residential",
    description: "",
    customerId: "",
    employeeId: "",
  });

  const fetchLands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/plots");
      const result = await res.json();
      if (result.success) {
        const plotsArray = Array.isArray(result.data?.plots)
          ? result.data.plots
          : Array.isArray(result.data)
          ? result.data
          : [];
        setLands(plotsArray);
      }
    } catch (error) {
      toast.error("Failed to fetch plots");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomersAndEmployees = async () => {
    setIsLoadingDropdowns(true);
    try {
      const [customersRes, employeesRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/admin/employees")
      ]);
      
      const customersResult = await customersRes.json();
      const employeesResult = await employeesRes.json();
      
      if (customersResult.success) {
        setCustomers(Array.isArray(customersResult.data) ? customersResult.data : []);
      }
      if (employeesResult.success) {
        setEmployees(Array.isArray(employeesResult.data) ? employeesResult.data : []);
      }
    } catch (error) {
      console.log("Failed to fetch customers/employees");
    } finally {
      setIsLoadingDropdowns(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const handleAddLand = async () => {
    try {
      const res = await fetch("/api/plots", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Plot added successfully");
        setIsAddDialogOpen(false);
        fetchLands();
        setFormData({
            plotNumber: "",
            area: 0,
            areaUnit: "sqft",
            location: "",
            totalPrice: 0,
            plotType: "Residential",
            description: "",
            customerId: "",
            employeeId: "",
          });
      } else {
        toast.error(result.message || "Failed to add plot");
      }
    } catch (error) {
      toast.error("Error adding plot");
    }
  };

  const handleDeleteLand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plot?")) return;
    try {
      const res = await fetch(`/api/plots/${id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Plot deleted successfully");
        fetchLands();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting plot");
    }
  };

  const filteredLands = lands.filter((land) => {
    const matchesSearch =
      land.plotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || land.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Land Management</h1>
          <p className="text-muted-foreground">
            Manage all land plots and their details
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (open) {
            fetchCustomersAndEmployees();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Land
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Land Plot</DialogTitle>
              <DialogDescription>
                Enter the details for the new land plot.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="plotNumber">Plot Number</Label>
                  <Input 
                    id="plotNumber" 
                    placeholder="VT-XXX" 
                    value={formData.plotNumber} 
                    onChange={e => setFormData({...formData, plotNumber: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="area">Area</Label>
                  <Input 
                    id="area" 
                    type="number"
                    placeholder="e.g., 1200" 
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="areaUnit">Area Unit</Label>
                  <Select value={formData.areaUnit} onValueChange={v => setFormData({...formData, areaUnit: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">Sq. Ft</SelectItem>
                      <SelectItem value="sqyard">Sq. Yard</SelectItem>
                      <SelectItem value="acre">Acre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="totalPrice">Total Price</Label>
                  <Input 
                    id="totalPrice" 
                    type="number" 
                    placeholder="Enter price" 
                    value={formData.totalPrice}
                    onChange={e => setFormData({...formData, totalPrice: Number(e.target.value)})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="plotType">Plot Type</Label>
                  <Select value={formData.plotType} onValueChange={v => setFormData({...formData, plotType: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter plot description"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="customerId">Customer (Optional)</Label>
                  <Select value={formData.customerId} onValueChange={v => setFormData({...formData, customerId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="employeeId">Employee (Optional)</Label>
                  <Select value={formData.employeeId} onValueChange={v => setFormData({...formData, employeeId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLand}>
                Add Land
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by plot number or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lands Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            All Lands ({filteredLands.length})
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
                    <TableHead>Plot Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Monthly EMI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredLands.map((land) => (
                    <TableRow key={land._id}>
                        <TableCell className="font-medium">
                        {land.plotNumber}
                        </TableCell>
                        <TableCell>{land.location}</TableCell>
                        <TableCell>{land.area} {land.areaUnit}</TableCell>
                        <TableCell>{formatCurrency(land.totalPrice)}</TableCell>
                        <TableCell>
                        {formatCurrency(land.pricePerUnit)} /{land.areaUnit}
                        </TableCell>
                        <TableCell>
                        <Badge
                            variant="outline"
                            className={cn("capitalize", getStatusColor(land.status))}
                        >
                            {land.status}
                        </Badge>
                        </TableCell>
                        <TableCell>
                        {land.customer ? (
                            <div className="flex flex-col">
                            <span className="text-sm font-medium">{land.customer.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {land.customer.employeeName || "No Employee"}
                            </span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                        </TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteLand(land._id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
