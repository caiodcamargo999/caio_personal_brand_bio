"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export function GlobalOperationSection() {
  const { t } = useI18n();

  return (
    <section className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-0 sm:px-4 mt-20 overflow-hidden border border-border/40 rounded-3xl bg-black/40 backdrop-blur-sm md:min-h-[600px] lg:min-h-[700px]">
      
      {/* Text Content */}
      <div className="relative flex-1 p-8 pb-4 md:p-16 z-20 pointer-events-auto md:max-w-[60%] lg:max-w-[55%]">
        <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
          {t('about.title')}
        </h2>
        
        <p className="text-xl sm:text-2xl text-white font-medium mb-6">
          {t('about.subtitle')} <span className="bg-white text-black px-2 py-1 rounded inline-block mt-2 sm:mt-0">{t('about.highlight')}</span>
        </p>

        <p className="text-muted-foreground text-lg max-w-lg mb-4 leading-relaxed font-light">
          {t('about.text1')}
        </p>
        <p className="text-muted-foreground text-lg max-w-lg mb-6 leading-relaxed font-light">
          {t('about.text2')}
        </p>
        <p className="text-white text-lg max-w-lg mb-8 leading-relaxed font-medium">
          {t('about.text3')}
        </p>

      </div>

      {/* Profile Picture (SyForge Style) */}
      <div className="relative md:absolute bottom-0 right-0 w-[120%] sm:w-full md:w-[60%] lg:w-[55%] h-[380px] sm:h-[450px] md:h-[95%] z-10 pointer-events-none flex justify-center md:justify-end items-end self-end md:self-auto translate-x-[5%] sm:translate-x-0 mt-4 md:mt-0">
        
        {/* Deep Glow Behind the Person */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/40 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-purple-500/30 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* Huge Hero Image */}
        <div className="relative w-full h-full">
          <Image 
            src="/images/caio-arms-crossed-nobg.png?v=1" 
            alt="Caio de Camargo" 
            fill 
            className="object-contain object-bottom md:object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
