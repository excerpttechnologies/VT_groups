"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface CTASectionProps {
  onDemoClick: (role: string) => void;
  isLoading: boolean;
}

export function CTASection({ onDemoClick, isLoading }: CTASectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20" />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
        animate={{
          y: [0, 40, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-10 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Land Business?
            </span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Join hundreds of land distributors who are revolutionizing their operations with VT Groups. Start your free trial today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.button
                  className="relative px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-2">
                    Get Started Today
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </motion.button>
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDemoClick("admin")}
              disabled={isLoading}
              className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Explore Demo"
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
