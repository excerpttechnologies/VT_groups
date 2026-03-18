"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, Cloud, Clock, Smartphone, LucideIcon } from "lucide-react";

interface SecurityFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function SecuritySection() {
  const features: SecurityFeature[] = [
    {
      icon: Lock,
      title: "Encrypted Data",
      description: "End-to-end encryption with AES-256",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure permission management",
    },
    {
      icon: Cloud,
      title: "Cloud Backup",
      description: "Automatic daily backups",
    },
    {
      icon: Clock,
      title: "Activity Logs",
      description: "Complete audit trail",
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4" variant="outline">
              Security
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Enterprise-Grade Security
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Your data is protected with industry-leading security measures. We employ multiple layers of encryption and access controls to ensure your business data stays safe.
            </p>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-2 gap-6"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature) => (
                <motion.div key={feature.title} variants={item}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-default"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <feature.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 via-blue-500/5 to-primary/5 border-primary/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="rounded-full bg-gradient-to-br from-primary/20 to-blue-500/10 p-4"
                    >
                      <Smartphone className="h-8 w-8 text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold">Access Anywhere</h4>
                      <p className="text-muted-foreground">Mobile-friendly experience</p>
                    </div>
                  </motion.div>

                  <p className="text-muted-foreground leading-relaxed">
                    Access your dashboard securely from any device. Our responsive design ensures a seamless experience on desktop, tablet, and mobile platforms.
                  </p>

                  {/* Lock Icon Visual */}
                  <motion.div
                    className="mt-8 relative h-48 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, linear: true }}
                      className="absolute"
                    >
                      <div className="w-24 h-24 rounded-full border-2 border-primary/20" />
                    </motion.div>
                    <Lock className="h-12 w-12 text-primary relative" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
