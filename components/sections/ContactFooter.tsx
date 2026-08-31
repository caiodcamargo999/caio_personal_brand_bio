"use client";

import React, { useState } from "react";
import { TextureButton } from "@/components/ui/texture-button";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { useI18n } from "@/lib/i18n";

export function ContactFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="relative flex w-full items-center justify-center px-4 mt-16 sm:mt-24 lg:mt-32 mb-12 sm:mb-20">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[350px] sm:h-[450px] bg-gradient-to-r from-[#ff4b17]/15 via-purple-600/10 to-[#ff4b17]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl w-full text-center">
        <div className="bg-[#0d0d0d]/90 backdrop-blur-2xl border border-white/[0.1] hover:border-white/20 transition-all duration-300 relative flex flex-col items-center p-8 sm:p-14 lg:p-20 rounded-3xl shadow-2xl shadow-black/90">
          
          {/* Top Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1 rounded-full">
              [ 04 // INITIATE PARTNERSHIP ]
            </span>
          </div>

          <h2 className="text-3xl font-semibold sm:text-4xl lg:text-6xl tracking-tight text-white mb-5 max-w-3xl leading-tight">
            {t('finalCta.title')}
          </h2>
          
          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-8 sm:mb-10 font-light">
            {t('finalCta.description')}
          </p>
          
          <TextureButton 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto min-w-[240px] shadow-2xl shadow-white/10" 
            onClick={() => setIsModalOpen(true)}
          >
            {t('finalCta.button')} <span className="text-xs opacity-60 ml-2 hidden sm:inline-block font-mono">⌘K</span>
          </TextureButton>
          
          <p className="mt-8 text-xs sm:text-sm font-mono tracking-wider uppercase text-zinc-400">
            {t('finalCta.footer')}
          </p>
        </div>
      </div>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

