"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string;
  prefix?: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

const AnimatedNumber = ({ value, prefix = "" }: { value: string; prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  const numericValue = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/\d/g, "");

  useEffect(() => {
    if (!inView) return;

    let startValue = 0;
    const increment = Math.ceil(numericValue / 50);
    const interval = setInterval(() => {
      startValue += increment;
      if (startValue >= numericValue) {
        setDisplayValue(numericValue + suffix);
        clearInterval(interval);
      } else {
        setDisplayValue(startValue + suffix);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [inView, numericValue, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
    </span>
  );
};

export function StatsSection({ stats }: StatsSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-12 border-y border-primary/10 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={item} className="text-center group">
              <motion.p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} />
              </motion.p>
              <p className="text-muted-foreground text-sm md:text-base mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
