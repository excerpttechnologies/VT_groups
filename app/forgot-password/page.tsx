"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Reset link sent to your email!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-white/5 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden ring-1 ring-white/5">
          <CardHeader className="text-center pt-10 pb-6 border-b border-white/5 bg-primary/5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-white">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              We&apos;ll send a secure link to reset your account credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-10">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Work Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-xl transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-black rounded-xl shadow-xl shadow-primary/10 gap-3 group" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <>
                      Send Reset Link
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowLeft className="h-5 w-5 rotate-180" />
                      </motion.div>
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 mb-6">
                  <p className="text-muted-foreground text-base leading-relaxed">
                    If an account exists for <span className="text-white font-bold">{email}</span>, you will receive a password reset link shortly.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Didn&apos;t receive anything?</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold">
                      Resend Email
                    </Button>
                    <Link href="/login">
                      <Button variant="ghost" className="h-12 w-full text-muted-foreground hover:text-white hover:bg-transparent font-medium">
                        Try Another Email
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40 mt-10 uppercase tracking-[0.2em] font-black">
          VT Groups Security Infrastructure
        </p>
      </motion.div>
    </div>
  );
}
