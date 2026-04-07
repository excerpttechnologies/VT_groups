"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Mail, Clock, HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function EmployeeSupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Support ticket created!");
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Ticket Submitted!</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Your support request has been received. Our admin team will get back to you within 24 hours.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display">Support Desk</h1>
        <p className="text-muted-foreground">
          Need help? Reach out to the administrators or check FAQs
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Direct Contact</CardTitle>
              <CardDescription>Get in touch with us immediately</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Phone</p>
                  <p className="font-bold">+91 7676870744</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Email</p>
                  <p className="font-bold">admin@vtgroups.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Hours</p>
                  <p className="font-bold">10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gold/5 border-gold/20 overflow-hidden relative">
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-gold/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-gold" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="p-3 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                How to record cash payments?
              </p>
              <p className="p-3 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                Updating plot status after sale
              </p>
              <p className="p-3 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                Merging duplicate customer records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Support Form */}
        <div className="lg:col-span-2">
          <Card className="h-full border-white/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Create Support Ticket
              </CardTitle>
              <CardDescription>Describe your issue and we&apos;ll help you solve it</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="What is this regarding?" required className="h-12 bg-white/5 border-white/10 focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic</label>
                    <select className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-sm focus:border-primary/50 outline-none">
                      <option>Payment Issue</option>
                      <option>Plot Allocation</option>
                      <option>Customer Inquiry</option>
                      <option>System Bug</option>
                      <option>Account Access</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Tell us more about the issue you're facing..."
                    className="min-h-[180px] bg-white/5 border-white/10 focus:border-primary/50 text-base leading-relaxed"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Submit Support Ticket
                      <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 italic">
                  A copy of this ticket will be sent to your registered email address.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
