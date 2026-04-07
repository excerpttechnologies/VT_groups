"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Mail, Clock, HelpCircle, Send, CheckCircle2, User, HelpCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CustomerSupportPage() {
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
          className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-8 border border-green-500/20 shadow-2xl shadow-green-500/10"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-3 font-display tracking-tight text-white">Ticket Submitted!</h2>
        <p className="text-muted-foreground text-center text-lg max-w-sm mb-10 leading-relaxed">
          Your support request is being reviewed by our customer service team. We&apos;ll notify you when they respond.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="h-12 px-8 rounded-xl font-bold bg-white/5 border-white/10 hover:bg-white/10 grayscale hover:grayscale-0 transition-all">
          Submit Another Request
        </Button>
      </div>
    );
  }

  const faqs = [
    { q: "How do I check my plot location?", a: "Go to 'My Lands' and click 'View Details' for your specific plot." },
    { q: "What are the available payment methods?", a: "We accept Online (UPI/Card) and Cash payments through our collection centers." },
    { q: "Can I pre-pay multiple installments?", a: "Yes, you can pay any amount at any time through our portal or by contacting your assigned employee." }
  ];

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1 font-black uppercase text-[10px] tracking-widest">Support Center</Badge>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-display text-white">How can we help?</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
          The VT Groups support team is here to assist you with land details, installments, and documentation queries.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column - Contact Info & FAQs */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-primary/5 border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader className="border-b border-primary/10 pb-6">
              <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                Support Manager
              </CardTitle>
              <CardDescription className="text-sm">Assigned specifically for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">Call Us</p>
                  <p className="font-bold text-white text-lg hover:text-primary transition-colors cursor-pointer">+91 7676870744</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">Email Us</p>
                  <p className="font-bold text-white text-lg hover:text-primary transition-colors cursor-pointer">support@vtgroups.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">Work Hours</p>
                  <p className="font-bold text-white text-lg">10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 px-2">
              <HelpCircleIcon className="h-5 w-5 text-gold" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group shadow-sm">
                  <p className="font-bold text-white/90 text-sm mb-2 pr-6 relative">
                    {faq.q}
                  </p>
                  <p className="text-sm text-muted-foreground/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Support Form */}
        <div className="lg:col-span-2">
          <Card className="h-full border-none bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-3xl shadow-2xl ring-1 ring-white/5">
            <CardHeader className="bg-primary/5 border-b border-white/5 p-10">
              <CardTitle className="text-3xl font-bold tracking-tight text-white flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                Open a Ticket
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg py-2">Our team is ready to assist you. Start your request below.</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Issue Subject</label>
                    <Input placeholder="E.g. Payment receipt not updated" required className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-xl" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Category</label>
                    <select className="w-full h-14 bg-[#0A0F1E] border border-white/10 rounded-xl px-4 text-base focus:border-primary/50 outline-none appearance-none cursor-pointer">
                      <option>Plot Allocation</option>
                      <option>Installment Queries</option>
                      <option>Technical Support</option>
                      <option>Documentation</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Detailed Explanation</label>
                  <Textarea
                    placeholder="Provide as much detail as possible about your query or concern..."
                    className="min-h-[220px] bg-white/5 border-white/10 focus:border-primary/50 text-lg leading-relaxed rounded-xl p-6"
                    required
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-xl font-black shadow-2xl shadow-primary/20 gap-4 group rounded-2xl bg-primary hover:bg-gold transition-all duration-500">
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Submit Request
                        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Send className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground/40 text-sm italic">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Average response time: 4-6 business hours
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
