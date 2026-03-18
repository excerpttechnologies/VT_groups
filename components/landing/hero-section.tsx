"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface HeroSectionProps {
  onDemoClick: (role: string) => void;
  isLoading: boolean;
}

export function HeroSection({ onDemoClick, isLoading }: HeroSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-50" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={item}>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" variant="outline">
              ✨ AI-Powered Land Management
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight"
          >
            Land Distribution &<br />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Installment Excellence
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={item}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty"
          >
            Streamline your land sales with intelligent management. Track plots, manage customers, and monitor installments in real-time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="gap-2 text-lg px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
                >
                  Start Free Trial
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 border-primary/20 hover:bg-primary/5 transition-all duration-300"
                onClick={() => onDemoClick("admin")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    View Demo
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
