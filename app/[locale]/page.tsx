"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Header />
      
      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
      </main>

      <footer className="w-full py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm border-t border-border/10 mt-0 safe-area-bottom px-4">
        © {new Date().getFullYear()} Caio de Camargo. All rights reserved.
      </footer>
    </div>
  );
}
