"use client";

import React from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export function GlobalOperationSection() {
  const { t } = useI18n();

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 lg:mt-32">
      {/* Outer Bento Card */}
      <div className="relative w-full flex flex-col lg:flex-row items-center justify-between overflow-hidden border border-white/[0.1] rounded-3xl bg-[#0d0d0d]/90 backdrop-blur-xl lg:min-h-[640px] shadow-2xl shadow-black/80 transition-all duration-300 hover:border-white/20">
        
        {/* Ambient Halo Behind Image */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#ff4b17]/20 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Text / Dossier Content */}
        <div className="relative flex-1 p-6 sm:p-10 lg:p-14 z-20 w-full lg:max-w-[55%] flex flex-col justify-between">
          
          <div>
            {/* Top Monospace Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                [ 01 // OPERATOR & ARCHITECT ]
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4 leading-tight">
              {t('about.title')}
            </h2>
            
            <p className="text-lg sm:text-xl text-zinc-200 font-medium mb-6 flex flex-wrap items-center gap-2">
              {t('about.subtitle')}{" "}
              <span className="bg-white text-black font-semibold text-sm sm:text-base px-2.5 py-0.5 rounded shadow-sm">
                {t('about.highlight')}
              </span>
            </p>

            <div className="space-y-4 text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light mt-6">
              <p>{t('about.text1')}</p>
              <p>{t('about.text2')}</p>
              <p className="text-white font-medium pt-2 text-base sm:text-lg lg:text-xl leading-snug">{t('about.text3')}</p>
            </div>
          </div>

        </div>

        {/* Caio's Portrait Cutout */}
        <div className="relative lg:absolute bottom-0 right-0 w-full sm:w-[90%] lg:w-[48%] h-[380px] sm:h-[460px] lg:h-[95%] z-10 pointer-events-none flex justify-center lg:justify-end items-end self-end mt-4 lg:mt-0">
          <div className="relative w-full h-full">
            <Image 
              src="/images/caio-arms-crossed-nobg.png?v=1" 
              alt="Caio de Camargo" 
              fill 
              className="object-contain object-bottom lg:object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}

