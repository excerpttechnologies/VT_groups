"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Map } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0F1E] px-4 text-center selection:bg-primary/30">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {/* Animated Icon Container */}
        <div className="relative mb-8 flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 0.95, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 p-6 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <Map className="h-20 w-20 text-gold" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive text-white shadow-lg"
          >
            <span className="text-lg font-bold">!</span>
          </motion.div>
        </div>

        {/* Text Content */}
        <h1 className="mb-2 text-8xl font-black tracking-tighter text-white md:text-9xl">
          4<span className="text-primary">0</span>4
        </h1>
        <h2 className="mb-6 text-2xl font-semibold text-white/90 md:text-3xl">
          Plot Not Found
        </h2>
        <p className="mx-auto mb-10 max-w-md text-lg text-muted-foreground">
          The page you are looking for has been moved, renamed, or perhaps never existed in our territory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button
              size="lg"
              className="group min-w-[160px] gap-2 rounded-xl bg-primary text-[#0d0d10] font-semibold hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="group min-w-[160px] gap-2 rounded-xl border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:scale-105 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Suggestion Links */}
        <div className="mt-16 border-t border-white/5 pt-8">
          <p className="mb-6 text-sm uppercase tracking-widest text-muted-foreground/60">
            Quick Navigation
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-3 w-3" />
              Search Plots
            </Link>
            <Link href="/support" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-3 w-3" />
              Contact Support
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-3 w-3" />
              Client Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
