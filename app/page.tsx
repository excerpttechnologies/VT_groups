// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext";
// import { useState } from "react";
// import { HeroSection } from "@/components/landing/hero-section";
// import { StatsSection } from "@/components/landing/stats-section";
// import { FeaturesSection } from "@/components/landing/features-section";
// import { UserPanelsCarousel } from "@/components/landing/user-panels-carousel";
// import { SecuritySection } from "@/components/landing/security-section";
// import { CTASection } from "@/components/landing/cta-section";
// import {
//   Map,
//   Users,
//   CreditCard,
//   BarChart3,
//   Shield,
//   Cloud,
//   ArrowRight,
//   Loader2
// } from "lucide-react";

// const features = [
//   {
//     icon: Map,
//     title: "Land Management",
//     description: "Comprehensive plot tracking with size, location, pricing, and installment details.",
//   },
//   {
//     icon: Users,
//     title: "Customer Portal",
//     description: "Self-service dashboard for customers to track payments and land details.",
//   },
//   {
//     icon: CreditCard,
//     title: "Payment Tracking",
//     description: "Real-time installment tracking with cash and online payment support.",
//   },
//   {
//     icon: BarChart3,
//     title: "Reports & Analytics",
//     description: "Detailed collection reports, payment history, and business insights.",
//   },
//   {
//     icon: Shield,
//     title: "Role-Based Access",
//     description: "Secure admin, employee, and customer roles with encrypted credentials.",
//   },
//   {
//     icon: Cloud,
//     title: "Cloud-Based",
//     description: "Access your data anywhere with our secure cloud infrastructure.",
//   },
// ];

// const stats = [
//   { label: "Plots Managed", value: "500+", prefix: "" },
//   { label: "Active Customers", value: "1,200+", prefix: "" },
//   { label: "Collections (Monthly)", value: "50+", prefix: "₹" },
//   { label: "Uptime", value: "99.9%", prefix: "" },
// ];

// const panels = [
//   {
//     id: "admin",
//     title: "Admin Panel",
//     subtitle: "Full system control",
//     badgeLabel: "Admin",
//     badgeColor: "bg-primary text-primary-foreground",
//     description: "Complete control over all system features and user management.",
//     gradient: "bg-gradient-to-br from-primary/20 to-primary/10",
//     textColor: "text-primary",
//     features: [
//       { item: "Manage all land plots" },
//       { item: "Create employee accounts" },
//       { item: "Track all payments" },
//       { item: "Generate reports" },
//       { item: "System configuration" },
//     ],
//   },
//   {
//     id: "employee",
//     title: "Employee Panel",
//     subtitle: "Collection management",
//     badgeLabel: "Employee",
//     badgeColor: "bg-blue-500 text-white",
//     description: "Manage collections, customers, and payment tracking.",
//     gradient: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
//     textColor: "text-blue-500",
//     features: [
//       { item: "View assigned lands" },
//       { item: "Manage customers" },
//       { item: "Collect payments" },
//       { item: "Update payment status" },
//       { item: "Raise support queries" },
//     ],
//   },
//   {
//     id: "customer",
//     title: "Customer Panel",
//     subtitle: "Self-service portal",
//     badgeLabel: "Customer",
//     badgeColor: "bg-green-500 text-white",
//     description: "Track your land details and installment payments.",
//     gradient: "bg-gradient-to-br from-green-500/20 to-green-500/10",
//     textColor: "text-green-500",
//     features: [
//       { item: "View land details" },
//       { item: "Track installments" },
//       { item: "Payment history" },
//       { item: "Receive notifications" },
//       { item: "Payment reminders" },
//     ],
//   },
// ];

// export default function LandingPage() {
//   const { login } = useAuth();
//   const [demoRole, setDemoRole] = useState<string | null>(null);

//   const handleDemoLogin = async (panelId: string) => {
//     const roleMap: { [key: string]: 'admin' | 'employee' | 'customer' } = {
//       admin: 'admin',
//       employee: 'employee',
//       customer: 'customer',
//     };
    
//     const role = roleMap[panelId];
//     if (!role) return;

//     setDemoRole(panelId);
//     const credentials = {
//       admin: { email: 'admin@vtgroups.com', password: 'Admin@123' },
//       employee: { email: 'employee@vtgroups.com', password: 'Emp@123' },
//       customer: { email: 'customer@vtgroups.com', password: 'Cust@123' }
//     }[role];

//     try {
//       await login({ ...credentials, role });
//     } catch (error) {
//       console.error('Demo login failed');
//     } finally {
//       setDemoRole(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="bg-white p-1 rounded-md" style={{ width: 'auto', height: '40px' }}>
//               <Image
//                 src="/VT-Groups-v2.png"
//                 alt="VT Groups Logo"
//                 width={120}
//                 height={40}
//                 className="h-full w-auto object-contain"
//                 priority
//                 style={{ width: 'auto', height: '100%' }}
//               />
//             </div>
//           </Link>
//           <div className="flex items-center gap-4">
//             <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               Sign In
//             </Link>
//             <Link href="/login">
//               <button className="px-4 py-2 rounded-lg bg-primary text-[#0d0d10] font-medium hover:bg-primary/90 transition-colors">
//                 Get Started
//               </button>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <HeroSection onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

//       {/* Stats Section */}
//       <StatsSection stats={stats} />

//       {/* Features Section */}
//       <FeaturesSection features={features} />

//       {/* User Panels Carousel */}
//       <UserPanelsCarousel 
//         panels={panels}
//         onDemoClick={handleDemoLogin}
//         isLoading={!!demoRole}
//       />

//       {/* Security Section */}
//       <SecuritySection />

//       {/* CTA Section */}
//       <CTASection onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

//       {/* Footer */}
//       <footer className="py-12 border-t border-border/50 bg-gradient-to-b from-background to-background/50">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="bg-white p-1 rounded-sm" style={{ width: 'auto', height: '32px' }}>
//                 <Image
//                   src="/VT-Groups-v2.png"
//                   alt="VT Groups Logo"
//                   width={32}
//                   height={32}
//                   className="h-full w-auto object-contain"
//                   style={{ width: 'auto', height: '100%' }}
//                 />
//               </div>
//             </Link>
//             <p className="text-sm text-muted-foreground">
//               Developed by{" "}
//               <span className="text-primary font-medium">
//                 Excerpt Technologies Pvt Ltd
//               </span>
//             </p>
//             <p className="text-sm text-muted-foreground">
//               © 2024 VT Groups. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext";
// import { useState, useEffect, useRef } from "react";
// import { StatsSection } from "@/components/landing/stats-section";
// import { FeaturesSection } from "@/components/landing/features-section";
// import { UserPanelsCarousel } from "@/components/landing/user-panels-carousel";
// import { SecuritySection } from "@/components/landing/security-section";
// import { CTASection } from "@/components/landing/cta-section";
// import {
//   Map,
//   Users,
//   CreditCard,
//   BarChart3,
//   Shield,
//   Cloud,
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   ArrowRight,
//   Loader2,
// } from "lucide-react";

// const features = [
//   {
//     icon: Map,
//     title: "Land Management",
//     description: "Comprehensive plot tracking with size, location, pricing, and installment details.",
//   },
//   {
//     icon: Users,
//     title: "Customer Portal",
//     description: "Self-service dashboard for customers to track payments and land details.",
//   },
//   {
//     icon: CreditCard,
//     title: "Payment Tracking",
//     description: "Real-time installment tracking with cash and online payment support.",
//   },
//   {
//     icon: BarChart3,
//     title: "Reports & Analytics",
//     description: "Detailed collection reports, payment history, and business insights.",
//   },
//   {
//     icon: Shield,
//     title: "Role-Based Access",
//     description: "Secure admin, employee, and customer roles with encrypted credentials.",
//   },
//   {
//     icon: Cloud,
//     title: "Cloud-Based",
//     description: "Access your data anywhere with our secure cloud infrastructure.",
//   },
// ];

// const stats = [
//   { label: "Plots Managed", value: "500+", prefix: "" },
//   { label: "Active Customers", value: "1,200+", prefix: "" },
//   { label: "Collections (Monthly)", value: "50+", prefix: "₹" },
//   { label: "Uptime", value: "99.9%", prefix: "" },
// ];

// // 🏞️ Replace src values with your actual land images when ready
// const landSlides = [
//   {
//     src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=90",
//     title: "Green Valley Estate",
//     location: "Hyderabad, Telangana",
//     size: "200 sq yd",
//     status: "Available",
//     statusColor: "bg-green-500",
//     description: "Lush green surroundings with excellent road connectivity and water supply.",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1920&q=90",
//     title: "Sunrise Plots – Sector 4",
//     location: "Pune, Maharashtra",
//     size: "300 sq yd",
//     status: "Partially Sold",
//     statusColor: "bg-yellow-500",
//     description: "Premium township development with RERA approved plots and clear titles.",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90",
//     title: "Lakeview Premium Land",
//     location: "Bengaluru, Karnataka",
//     size: "150 sq yd",
//     status: "Available",
//     statusColor: "bg-green-500",
//     description: "Scenic hilltop location with panoramic views and gated community access.",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=90",
//     title: "Highland Reserve",
//     location: "Chennai, Tamil Nadu",
//     size: "250 sq yd",
//     status: "Sold Out",
//     statusColor: "bg-red-500",
//     description: "Elevated terrain offering cool climate and breathtaking natural beauty.",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=90",
//     title: "Meadow Fields – Block B",
//     location: "Vizag, Andhra Pradesh",
//     size: "175 sq yd",
//     status: "Available",
//     statusColor: "bg-green-500",
//     description: "Flat, fertile land ideal for residential construction with modern amenities.",
//   },
// ];

// const panels = [
//   {
//     id: "admin",
//     title: "Admin Panel",
//     subtitle: "Full system control",
//     badgeLabel: "Admin",
//     badgeColor: "bg-primary text-primary-foreground",
//     description: "Complete control over all system features and user management.",
//     gradient: "bg-gradient-to-br from-primary/20 to-primary/10",
//     textColor: "text-primary",
//     features: [
//       { item: "Manage all land plots" },
//       { item: "Create employee accounts" },
//       { item: "Track all payments" },
//       { item: "Generate reports" },
//       { item: "System configuration" },
//     ],
//   },
//   {
//     id: "employee",
//     title: "Employee Panel",
//     subtitle: "Collection management",
//     badgeLabel: "Employee",
//     badgeColor: "bg-blue-500 text-white",
//     description: "Manage collections, customers, and payment tracking.",
//     gradient: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
//     textColor: "text-blue-500",
//     features: [
//       { item: "View assigned lands" },
//       { item: "Manage customers" },
//       { item: "Collect payments" },
//       { item: "Update payment status" },
//       { item: "Raise support queries" },
//     ],
//   },
//   {
//     id: "customer",
//     title: "Customer Panel",
//     subtitle: "Self-service portal",
//     badgeLabel: "Customer",
//     badgeColor: "bg-green-500 text-white",
//     description: "Track your land details and installment payments.",
//     gradient: "bg-gradient-to-br from-green-500/20 to-green-500/10",
//     textColor: "text-green-500",
//     features: [
//       { item: "View land details" },
//       { item: "Track installments" },
//       { item: "Payment history" },
//       { item: "Receive notifications" },
//       { item: "Payment reminders" },
//     ],
//   },
// ];

// // ─── Full-Screen Hero Slider (replaces HeroSection) ──────────────────────────
// function HeroSlider({
//   onDemoClick,
//   isLoading,
// }: {
//   onDemoClick: (role: string) => void;
//   isLoading: boolean;
// }) {
//   const [current, setCurrent] = useState(0);
//   const [animating, setAnimating] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const total = landSlides.length;

//   const goTo = (index: number) => {
//     if (animating) return;
//     setAnimating(true);
//     setCurrent((index + total) % total);
//     setTimeout(() => setAnimating(false), 600);
//   };

//   useEffect(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % total);
//     }, 5000);
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [current, total]);

//   const slide = landSlides[current];

//   return (
//     <section className="relative w-full h-screen min-h-[600px] overflow-hidden">

//       {/* Background images — cross-fade */}
//       {landSlides.map((s, i) => (
//         <div
//           key={i}
//           className="absolute inset-0 transition-opacity duration-700"
//           style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
//         >
//           <Image
//             src={s.src}
//             alt={s.title}
//             fill
//             className="object-cover"
//             priority={i === 0}
//             unoptimized
//           />
//         </div>
//       ))}

//       {/* Overlay layers */}
//       <div className="absolute inset-0 z-10 bg-black/55" />
//       <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/50" />
//       <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

//       {/* Brand badge — clears the fixed nav */}
//       <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
//         <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest backdrop-blur-sm">
//           Premium Land by VT Groups
//         </span>
//       </div>

//       {/* Main centered content */}
//       <div
//         className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-all duration-500"
//         style={{
//           opacity: animating ? 0 : 1,
//           transform: animating ? "translateY(14px)" : "translateY(0)",
//         }}
//       >
//         {/* Status */}
//         <div className="flex items-center gap-2 mb-4">
//           <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${slide.statusColor}`} />
//           <span className="text-sm text-white/80 font-medium tracking-wide">{slide.status}</span>
//         </div>

//         {/* Title */}
//         <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 drop-shadow-2xl leading-tight max-w-4xl">
//           {slide.title}
//         </h1>

//         {/* Location */}
//         <div className="flex items-center justify-center gap-1.5 text-white/70 text-base mb-4">
//           <MapPin size={16} className="text-primary" />
//           <span>{slide.location}</span>
//         </div>

//         {/* Description */}
//         <p className="text-white/60 max-w-lg text-sm md:text-base mb-8 leading-relaxed">
//           {slide.description}
//         </p>

//         {/* Plot size + actions */}
//         <div className="flex items-center gap-4 flex-wrap justify-center">
//           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 text-center">
//             <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">Plot Size</p>
//             <p className="text-white font-bold text-lg">{slide.size}</p>
//           </div>

//           <Link href="/login">
//             <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-[#0d0d10] font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/30">
//               Enquire Now <ArrowRight size={16} />
//             </button>
//           </Link>

//           <button
//             onClick={() => onDemoClick("admin")}
//             disabled={isLoading}
//             className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all hover:scale-105"
//           >
//             {isLoading ? (
//               <Loader2 size={16} className="animate-spin" />
//             ) : null}
//             Try Demo
//           </button>
//         </div>
//       </div>

//       {/* Left arrow */}
//       <button
//         onClick={() => goTo(current - 1)}
//         className="absolute left-5 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-primary/70 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
//         aria-label="Previous"
//       >
//         <ChevronLeft size={22} />
//       </button>

//       {/* Right arrow */}
//       <button
//         onClick={() => goTo(current + 1)}
//         className="absolute right-5 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-primary/70 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
//         aria-label="Next"
//       >
//         <ChevronRight size={22} />
//       </button>

//       {/* Dot indicators */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
//         {landSlides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => goTo(i)}
//             className={`rounded-full transition-all duration-300 ${
//               i === current
//                 ? "w-8 h-2.5 bg-primary shadow-lg shadow-primary/50"
//                 : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
//             }`}
//             aria-label={`Slide ${i + 1}`}
//           />
//         ))}
//       </div>

//       {/* Slide counter — bottom right */}
//       <div className="absolute bottom-8 right-6 z-30 text-white/40 text-xs tabular-nums">
//         <span className="text-white font-semibold">{String(current + 1).padStart(2, "0")}</span>
//         {" / "}
//         {String(total).padStart(2, "0")}
//       </div>

//       {/* Progress bar */}
//       <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
//         <div
//           className="h-full bg-primary transition-all duration-[5000ms] ease-linear"
//           style={{ width: `${((current + 1) / total) * 100}%` }}
//         />
//       </div>
//     </section>
//   );
// }
// // ──────────────────────────────────────────────────────────────────────────────

// export default function LandingPage() {
//   const { login } = useAuth();
//   const [demoRole, setDemoRole] = useState<string | null>(null);

//   const handleDemoLogin = async (panelId: string) => {
//     const roleMap: { [key: string]: 'admin' | 'employee' | 'customer' } = {
//       admin: 'admin',
//       employee: 'employee',
//       customer: 'customer',
//     };

//     const role = roleMap[panelId];
//     if (!role) return;

//     setDemoRole(panelId);
//     const credentials = {
//       admin: { email: 'admin@vtgroups.com', password: 'Admin@123' },
//       employee: { email: 'employee@vtgroups.com', password: 'Emp@123' },
//       customer: { email: 'customer@vtgroups.com', password: 'Cust@123' }
//     }[role];

//     try {
//       await login({ ...credentials, role });
//     } catch (error) {
//       console.error('Demo login failed');
//     } finally {
//       setDemoRole(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">

//       {/* Fixed Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="bg-white p-1 rounded-md" style={{ width: 'auto', height: '48px' }}>
//               <Image
//                 src="/VT-Groups-v2.png"
//                 alt="VT Groups Logo"
//                 width={144}
//                 height={48}
//                 className="h-full w-auto object-contain"
//                 priority
//                 style={{ width: 'auto', height: '100%' }}
//               />
//             </div>
//           </Link>
//           <div className="flex items-center gap-4">
//             <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//               Sign In
//             </Link>
//             <Link href="/login">
//               <button className="px-4 py-2 rounded-lg bg-primary text-[#0d0d10] font-medium hover:bg-primary/90 transition-colors">
//                 Get Started
//               </button>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* 🏞️ Hero Slider — replaces HeroSection entirely */}
//       <HeroSlider onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

//       {/* Stats Section */}
//       <StatsSection stats={stats} />

//       {/* Features Section */}
//       <FeaturesSection features={features} />

//       {/* User Panels Carousel */}
//       <UserPanelsCarousel
//         panels={panels}
//         onDemoClick={handleDemoLogin}
//         isLoading={!!demoRole}
//       />

//       {/* Security Section */}
//       <SecuritySection />

//       {/* CTA Section */}
//       <CTASection onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

//       {/* Footer */}
//       <footer className="py-12 border-t border-border/50 bg-gradient-to-b from-background to-background/50">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="bg-white p-1 rounded-sm" style={{ width: 'auto', height: '40px' }}>
//                 <Image
//                   src="/VT-Groups-v2.png"
//                   alt="VT Groups Logo"
//                   width={50}
//                   height={50}
//                   className="h-full w-auto object-contain"
//                   style={{ width: 'auto', height: '100%' }}
//                 />
//               </div>
//             </Link>
//             <p className="text-sm text-muted-foreground">
//               Developed by{" "}
//               <span className="text-primary font-medium">
//                 Excerpt Technologies Pvt Ltd
//               </span>
//             </p>
//             <p className="text-sm text-muted-foreground">
//               © 2024 VT Groups. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext";
// import { useState } from "react";
// import { HeroSection } from "@/components/landing/hero-section";
// import { StatsSection } from "@/components/landing/stats-section";
// import { FeaturesSection } from "@/components/landing/features-section";
// import { UserPanelsCarousel } from "@/components/landing/user-panels-carousel";
// import { SecuritySection } from "@/components/landing/security-section";
// import { CTASection } from "@/components/landing/cta-section";
// import {
//   Map,
//   Users,
//   CreditCard,
//   BarChart3,
//   Shield,
//   Cloud,
//   ArrowRight,
//   Loader2
// } from "lucide-react";

// const features = [ ... ];
// const stats = [ ... ];
// const panels = [ ... ];

// export default function LandingPage() { ... }

"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { UserPanelsCarousel } from "@/components/landing/user-panels-carousel";
import { SecuritySection } from "@/components/landing/security-section";
import { CTASection } from "@/components/landing/cta-section";
import {
  Map,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Cloud,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Land Management",
    description: "Comprehensive plot tracking with size, location, pricing, and installment details.",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Self-service dashboard for customers to track payments and land details.",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description: "Real-time installment tracking with cash and online payment support.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Detailed collection reports, payment history, and business insights.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure admin, employee, and customer roles with encrypted credentials.",
  },
  {
    icon: Cloud,
    title: "Cloud-Based",
    description: "Access your data anywhere with our secure cloud infrastructure.",
  },
];

const stats = [
  { label: "Plots Managed", value: "500+", prefix: "" },
  { label: "Active Customers", value: "1,200+", prefix: "" },
  { label: "Collections (Monthly)", value: "50+", prefix: "₹" },
  { label: "Uptime", value: "99.9%", prefix: "" },
];

const landSlides = [
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=90",
    title: "Green Valley Estate",
    location: "Hyderabad, Telangana",
    size: "200 sq yd",
    status: "Available",
    statusColor: "bg-green-500",
    description: "Lush green surroundings with excellent road connectivity and water supply.",
  },
  {
    src: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1920&q=90",
    title: "Sunrise Plots – Sector 4",
    location: "Pune, Maharashtra",
    size: "300 sq yd",
    status: "Partially Sold",
    statusColor: "bg-yellow-500",
    description: "Premium township development with RERA approved plots and clear titles.",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90",
    title: "Lakeview Premium Land",
    location: "Bengaluru, Karnataka",
    size: "150 sq yd",
    status: "Available",
    statusColor: "bg-green-500",
    description: "Scenic hilltop location with panoramic views and gated community access.",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=90",
    title: "Highland Reserve",
    location: "Chennai, Tamil Nadu",
    size: "250 sq yd",
    status: "Sold Out",
    statusColor: "bg-red-500",
    description: "Elevated terrain offering cool climate and breathtaking natural beauty.",
  },
  {
    src: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=90",
    title: "Meadow Fields – Block B",
    location: "Vizag, Andhra Pradesh",
    size: "175 sq yd",
    status: "Available",
    statusColor: "bg-green-500",
    description: "Flat, fertile land ideal for residential construction with modern amenities.",
  },
];

const panels = [
  {
    id: "admin",
    title: "Admin Panel",
    subtitle: "Full system control",
    badgeLabel: "Admin",
    badgeColor: "bg-primary text-primary-foreground",
    description: "Complete control over all system features and user management.",
    gradient: "bg-gradient-to-br from-primary/20 to-primary/10",
    textColor: "text-primary",
    features: [
      { item: "Manage all land plots" },
      { item: "Create employee accounts" },
      { item: "Track all payments" },
      { item: "Generate reports" },
      { item: "System configuration" },
    ],
  },
  {
    id: "employee",
    title: "Employee Panel",
    subtitle: "Collection management",
    badgeLabel: "Employee",
    badgeColor: "bg-blue-500 text-white",
    description: "Manage collections, customers, and payment tracking.",
    gradient: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
    textColor: "text-blue-500",
    features: [
      { item: "View assigned lands" },
      { item: "Manage customers" },
      { item: "Collect payments" },
      { item: "Update payment status" },
      { item: "Raise support queries" },
    ],
  },
  {
    id: "customer",
    title: "Customer Panel",
    subtitle: "Self-service portal",
    badgeLabel: "Customer",
    badgeColor: "bg-green-500 text-white",
    description: "Track your land details and installment payments.",
    gradient: "bg-gradient-to-br from-green-500/20 to-green-500/10",
    textColor: "text-green-500",
    features: [
      { item: "View land details" },
      { item: "Track installments" },
      { item: "Payment history" },
      { item: "Receive notifications" },
      { item: "Payment reminders" },
    ],
  },
];

// ─── Full-Screen Hero Slider ──────────────────────────────────────────────────
function HeroSlider({
  onDemoClick,
  isLoading,
}: {
  onDemoClick: (role: string) => void;
  isLoading: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = landSlides.length;

  // Preload all images on mount so they're cached before the user reaches them
  useEffect(() => {
    landSlides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  const goTo = (index: number) => {
    if (animating) return;
    const next = (index + total) % total;
    if (next === current) return;
    setPrev(current);
    setAnimating(true);
    setCurrent(next);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 700);
  };

  // Reset auto-advance timer whenever current changes
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo(current + 1);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, animating]);

  const slide = landSlides[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">

      {/* 
        ✅ FIX: Render ALL slide images at all times so the browser keeps them in cache.
        Only the active (current) slide is fully visible; others have opacity-0 but are
        still painted, so the next image is always ready instantly.
      */}
      {landSlides.map((s, i) => {
        const isActive = i === current;
        const isPrev = i === prev;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              opacity: isActive ? 1 : 0,
              transition: isActive ? "opacity 700ms ease-in-out" : "none",
              // Keep previous slide visible during the cross-fade
              ...(isPrev ? { opacity: 1 } : {}),
            }}
          >
            {/*
              ✅ FIX: Use native <img> instead of Next.js <Image> for external Unsplash URLs.
              Next.js <Image> with external domains requires next.config domains/remotePatterns
              configuration and adds its own optimisation layer that can interfere with
              preloading. Using a plain <img> guarantees the browser fetches & caches
              the URL exactly as written.

              If you DO want to use Next.js <Image>, add unsplash to remotePatterns in
              next.config.js and remove the `unoptimized` prop:
                remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }]
            */}
            <img
              src={s.src}
              alt={s.title}
              // Always decode eagerly so paint is instant when we fade in
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        );
      })}

      {/* Overlay layers */}
      <div className="absolute inset-0 z-10 bg-black/55" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/50" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Brand badge */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest backdrop-blur-sm">
          Premium Land by VT Groups
        </span>
      </div>

      {/* Main centered content */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        style={{
          transition: "opacity 400ms ease, transform 400ms ease",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(14px)" : "translateY(0)",
        }}
      >
        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${slide.statusColor}`} />
          <span className="text-sm text-white/80 font-medium tracking-wide">{slide.status}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 drop-shadow-2xl leading-tight max-w-4xl">
          {slide.title}
        </h1>

        {/* Location */}
        <div className="flex items-center justify-center gap-1.5 text-white/70 text-base mb-4">
          <MapPin size={16} className="text-primary" />
          <span>{slide.location}</span>
        </div>

        {/* Description */}
        <p className="text-white/60 max-w-lg text-sm md:text-base mb-8 leading-relaxed">
          {slide.description}
        </p>

        {/* Plot size + actions */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 text-center">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">Plot Size</p>
            <p className="text-white font-bold text-lg">{slide.size}</p>
          </div>

          <Link href="/login">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-[#0d0d10] font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/30">
              Enquire Now <ArrowRight size={16} />
            </button>
          </Link>

          <button
            onClick={() => onDemoClick("admin")}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all hover:scale-105 disabled:opacity-60"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Try Demo
          </button>
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-primary/70 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-primary/70 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {landSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2.5 bg-primary shadow-lg shadow-primary/50"
                : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 z-30 text-white/40 text-xs tabular-nums">
        <span className="text-white font-semibold">{String(current + 1).padStart(2, "0")}</span>
        {" / "}
        {String(total).padStart(2, "0")}
      </div>

      {/* Progress bar — resets on each slide change via key */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
        <div
          key={current} // ✅ FIX: key forces a full remount → CSS animation restarts cleanly
          className="h-full bg-primary"
          style={{
            animation: "progressBar 5000ms linear forwards",
          }}
        />
      </div>

      {/* Inline keyframe for progress bar */}
      <style>{`
        @keyframes progressBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
// ──────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { login } = useAuth();
  const [demoRole, setDemoRole] = useState<string | null>(null);

  const handleDemoLogin = async (panelId: string) => {
    const roleMap: { [key: string]: "admin" | "employee" | "customer" } = {
      admin: "admin",
      employee: "employee",
      customer: "customer",
    };

    const role = roleMap[panelId];
    if (!role) return;

    setDemoRole(panelId);
    const credentials = {
      admin: { email: "admin@vtgroups.com", password: "Admin@123" },
      employee: { email: "employee@vtgroups.com", password: "Emp@123" },
      customer: { email: "customer@vtgroups.com", password: "Cust@123" },
    }[role];

    try {
      await login({ ...credentials, role });
    } catch (error) {
      console.error("Demo login failed");
    } finally {
      setDemoRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-md" style={{ width: "auto", height: "48px" }}>
              <Image
                src="/VT-Groups-v2.png"
                alt="VT Groups Logo"
                width={200}
                height={80}
                className="h-full w-auto object-contain"
                priority
                style={{ width: "auto", height: "100%" }}
              />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 rounded-lg bg-primary text-[#0d0d10] font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <HeroSlider onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* User Panels Carousel */}
      <UserPanelsCarousel
        panels={panels}
        onDemoClick={handleDemoLogin}
        isLoading={!!demoRole}
      />

      {/* Security Section */}
      <SecuritySection />

      {/* CTA Section */}
      <CTASection onDemoClick={handleDemoLogin} isLoading={!!demoRole} />

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-sm" style={{ width: "auto", height: "40px" }}>
                <Image
                  src="/VT-Groups-v2.png"
                  alt="VT Groups Logo"
                  width={50}
                  height={50}
                  className="h-full w-auto object-contain"
                  style={{ width: "auto", height: "100%" }}
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Developed by{" "}
              <span className="text-primary font-medium">Excerpt Technologies Pvt Ltd</span>
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 VT Groups. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}