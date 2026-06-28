"use client";

import React, { useState } from "react";
import { TextureButton } from "@/components/ui/texture-button";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { useI18n } from "@/lib/i18n";

export function ContactFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="relative flex w-full items-center justify-center p-4 mt-0 mb-8 md:my-20">
      <div className="mx-auto max-w-4xl w-full text-center">
        <div className="bg-card/40 backdrop-blur-md border border-border relative flex flex-col items-center p-10 md:p-16 rounded-3xl">
          <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl tracking-tight mb-6">
            {t('finalCta.title')}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            {t('finalCta.description')}
          </p>
          
          <TextureButton 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto min-w-[200px] mt-4" 
            onClick={() => setIsModalOpen(true)}
          >
            {t('finalCta.button')} <span className="text-xs opacity-70 ml-2 hidden sm:inline-block">⌘K</span>
          </TextureButton>
          
          <p className="mt-6 text-sm md:text-base font-medium text-white/80">
            {t('finalCta.footer')}
          </p>
        </div>
      </div>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
