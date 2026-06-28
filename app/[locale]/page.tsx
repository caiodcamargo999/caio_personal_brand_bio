"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsShowcaseSection } from "@/components/sections/ProjectsShowcaseSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { GlobalOperationSection } from "@/components/sections/GlobalOperationSection";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { useI18n } from "@/lib/i18n";


export default function HomePage() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      
      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection />
        <GlobalOperationSection />
        <ProjectsShowcaseSection />
        <ServicesSection />
        <ProcessSection />
        <ContactFooter />
      </main>

      <footer className="w-full pt-4 pb-12 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm border-t border-border/10 mt-0 px-4">
        © {new Date().getFullYear()} Caio de Camargo. {t('footer.rights')}
      </footer>
    </div>
  );
}
