"use client";

import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { OrbitalWireframe } from "@/components/ui/orbital-wireframe";
import { motion } from "framer-motion";

export function ServicesSection() {
  const { t, locale } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);

  const services = (t('services.items') as Array<{ title: string, description: string }>) || [];
  
  const formattedServices = services.map((s, idx) => ({
    id: `service-${idx}`,
    title: s.title,
    description: s.description,
  }));

  // Localized statement for the top glowing transition banner (Image 3 reference)
  const statementText = {
    en: "We built our strategy around the biggest growth levers for today's brands.",
    pt: "Construímos nossa estratégia em torno das maiores alavancas de crescimento para marcas modernas.",
    es: "Construimos nuestra estrategia en torno a las mayores palancas de crecimiento para marcas modernas.",
  }[locale] || "We built our strategy around the biggest growth levers for today's brands.";

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportMiddle = window.innerHeight / 2;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden mt-16 sm:mt-24 lg:mt-32" id="services">
      
      {/* ---------------------------------------------------- */}
      {/* 1. VIBRANT PINK / MAGENTA GLOW TRANSITION (Image 3) */}
      {/* ---------------------------------------------------- */}
      <div className="relative w-full pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Intense Pink / Magenta Atmospheric Blur Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[380px] sm:h-[450px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,54,162,0.42)_0%,rgba(220,0,180,0.18)_40%,transparent_75%)] pointer-events-none -z-10 blur-xl" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-[#ff36a2]/25 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-pink-300/80 bg-pink-500/[0.08] border border-pink-500/20 px-3.5 py-1 rounded-full backdrop-blur-md">
            [ CORE GROWTH LEVERS ]
          </span>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif sm:font-sans font-light md:font-normal text-white/95 leading-relaxed sm:leading-snug max-w-2xl mt-3 tracking-tight">
            {statementText}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. INTERACTIVE SCROLL SERVICES & 3D ORBIT (Image 4) */}
      {/* ---------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Scrollable Services List */}
          <div className="lg:col-span-7 flex flex-col gap-12 sm:gap-20 py-4 sm:py-8">
            {formattedServices.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={service.id}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  className={`relative p-6 sm:p-10 rounded-3xl transition-all duration-500 border ${
                    isActive
                      ? "bg-[#0d0d0d]/90 border-white/[0.15] shadow-2xl shadow-black/80"
                      : "bg-[#0a0a0a]/40 border-white/[0.05] opacity-60 hover:opacity-90"
                  }`}
                >
                  {/* Number Badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-serif text-sm text-white font-medium">
                      {["①", "②", "③", "④"][index] || `0${index + 1}`}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                      LEVER 0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif sm:font-sans font-medium text-white tracking-tight leading-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 sm:mt-5 text-zinc-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky 3D Orbital Geometry Viewport */}
          <div className="hidden lg:flex lg:col-span-5 sticky top-28 lg:top-36 h-[500px] items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center bg-[#0d0d0d]/60 border border-white/[0.08] rounded-3xl p-6 backdrop-blur-xl shadow-2xl shadow-black/80">
              <OrbitalWireframe
                activeIndex={activeIndex}
                services={formattedServices}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


