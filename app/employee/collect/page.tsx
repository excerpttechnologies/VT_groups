"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Banknote,
  Smartphone,
  Loader2,
} from "lucide-react";
import { formatCurrency, getStatusColor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CollectPaymentPage() {
  const { user } = useAuth();
  const [lands, setLands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLandId, setSelectedLandId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [notes, setNotes] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastPayment, setLastPayment] = useState<any>(null);

  useEffect(() => {
    const fetchLands = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/plots?status=Sold");
        const result = await res.json();
        if (result.success) {
          setLands(Array.isArray(result.data) ? result.data : []);
        }
      } catch (error) {
        toast.error("Failed to fetch lands");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLands();
  }, []);

  const landsArray = Array.isArray(lands) ? lands : [];
  const selectedLandData = landsArray.find((l) => l._id === selectedLandId);

  const handleSubmit = async () => {
    if (!selectedLandId || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plotId: selectedLandId,
          customerId: selectedLandData?.customerId?._id || selectedLandData?.customerId,
          amount: Number(amount),
          paymentMode: paymentMethod,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastPayment({ amount, paymentMethod, land: selectedLandData });
        setShowSuccessDialog(true);
        toast.success("Payment recorded successfully!");
      } else {
        toast.error(data.message || "Failed to record payment");
      }
    } catch (error) {
      toast.error("Error recording payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedLandId("");
    setAmount("");
    setPaymentMethod("Cash");
    setNotes("");
    setShowSuccessDialog(false);
    setLastPayment(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Collect Payment</h1>
        <p className="text-muted-foreground">
          Record a new installment payment from customers
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Land */}
            <div className="space-y-2">
              <Label>Select Land Plot</Label>
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading lands...</span>
                </div>
              ) : (
                <Select value={selectedLandId} onValueChange={setSelectedLandId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a plot..." />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((land) => (
                      <SelectItem key={land._id} value={land._id}>
                        {land.plotNumber} – {land.customerId?.name || "No Customer"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="pl-10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {selectedLandData && (
                <p className="text-sm text-muted-foreground">
                  Installment Amount:{" "}
                  <span
                    className="text-primary font-medium cursor-pointer"
                    onClick={() =>
                      setAmount(String(selectedLandData.price / 10)) // Simple mock EMI if not set
                    }
                  >
                    {formatCurrency(selectedLandData.totalPrice / 12)}
                  </span>{" "}
                  (click to autofill)
                </p>
              )}

            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Cash" id="Cash" />
                  <Label
                    htmlFor="Cash"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Banknote className="h-4 w-4 text-green-500" />
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Online" id="Online" />
                  <Label
                    htmlFor="Online"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    Online
                  </Label>
                </div>

              </RadioGroup>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedLandId || !amount || isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Recording...</>
              ) : (
                <><CheckCircle2 className="mr-2 h-5 w-5" /> Record Payment</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="space-y-6">
          {/* Selected Land Details */}
          {selectedLandData && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Land Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plot Number</p>
                    <p className="font-semibold">{selectedLandData.plotNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{selectedLandData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-semibold">
                      {selectedLandData.customerId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">
                      {selectedLandData.customerId?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly EMI (Est)</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(selectedLandData.totalPrice / 12)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedLandData.totalPrice)}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          )}

          {/* Help card */}
          {!selectedLandData && (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <CreditCard className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p>Select a land plot to view details and collect payment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-6 w-6" />
              Payment Recorded Successfully
            </DialogTitle>
            <DialogDescription>
              The payment has been recorded in MongoDB and the records have been
              updated.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">
                {formatCurrency(Number(lastPayment?.amount || 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  lastPayment?.paymentMethod === "cash"
                    ? "text-green-500 border-green-500/30"
                    : "text-blue-500 border-blue-500/30"
                )}
              >
                {lastPayment?.paymentMethod}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plot</span>
              <span>{lastPayment?.land?.plotNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span>{lastPayment?.land?.customerId?.name}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Collect Another
            </Button>
            <Button onClick={() => setShowSuccessDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
