"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Code2, Zap } from "lucide-react";
import { Loader2 } from "lucide-react";

interface PanelFeature {
  item: string;
  icon?: React.ReactNode;
}

interface Panel {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeColor: string;
  description: string;
  features: PanelFeature[];
  textColor: string;
  gradient: string;
}

interface UserPanelsCarouselProps {
  panels: Panel[];
  onDemoClick: (panelId: string) => void;
  isLoading: boolean;
}

export function UserPanelsCarousel({
  panels,
  onDemoClick,
  isLoading,
}: UserPanelsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(1); // Center card is active

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? panels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === panels.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/50 via-background to-background relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4" variant="outline">
            User Panels
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dedicated Dashboards for Every Role
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Tailored experiences designed for Admin, Employee, and Customer workflows
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto mb-8">
          {/* Cards */}
          <div className="relative h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {panels.map((panel, index) => {
                const isActive = index === activeIndex;
                const distance = Math.abs(index - activeIndex);
                const isLeft = index < activeIndex;
                const isFar = distance > 1;

                return (
                  <motion.div
                    key={panel.id}
                    className="absolute w-full max-w-sm"
                    initial={{
                      opacity: 0,
                      x: isLeft ? -400 : 400,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: isFar ? 0 : isActive ? 1 : 0.4,
                      x: isActive ? 0 : isLeft ? -150 : 150,
                      scale: isActive ? 1 : 0.85,
                      zIndex: isActive ? 10 : 5 - distance,
                    }}
                    exit={{
                      opacity: 0,
                      x: isLeft ? -400 : 400,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      whileHover={isActive ? { y: -10 } : {}}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card
                        className={`overflow-hidden backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300 ${
                          isActive
                            ? "ring-2 ring-primary/50 shadow-2xl shadow-primary/20"
                            : ""
                        }`}
                      >
                        {/* Header */}
                        <div
                          className={`${panel.gradient} p-6 border-b border-primary/10`}
                        >
                          <Badge className={`mb-2 ${panel.badgeColor}`}>
                            {panel.badgeLabel}
                          </Badge>
                          <h3 className="text-2xl font-bold text-foreground">
                            {panel.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {panel.subtitle}
                          </p>
                        </div>

                        {/* Content */}
                        <CardContent className="p-6">
                          <p className="text-muted-foreground text-sm mb-6">
                            {panel.description}
                          </p>

                          {/* Features List */}
                          <ul className="space-y-3 mb-6">
                            {panel.features.map((feature, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${panel.textColor}`} />
                                <span className="text-sm text-foreground">
                                  {feature.item}
                                </span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* CTA Button */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              className="w-full"
                              variant={isActive ? "default" : "outline"}
                              onClick={() => onDemoClick(panel.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              View {panel.title} Demo
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {panels.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-primary w-8"
                      : "bg-primary/30 w-2 hover:bg-primary/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
