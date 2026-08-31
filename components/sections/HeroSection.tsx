"use client";

import { useI18n } from "@/lib/i18n";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextureButton } from "@/components/ui/texture-button";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { Typewriter } from "@/components/ui/typewriter";
import { InteractiveMarquee } from "@/components/ui/interactive-marquee";
import { BackgroundImageTexture } from "@/components/ui/bg-image-texture";
import {
  GoogleAds,
} from "@aliimam/logos";
import { SiTiktok, SiMeta } from "react-icons/si";

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);



  const { t } = useI18n();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <BackgroundImageTexture variant="grid-noise" opacity={0.4} className="relative w-full my-4 sm:my-6 lg:my-10 flex flex-col items-center justify-center pt-20 sm:pt-24 lg:pt-32 pb-6 sm:pb-8 px-0 sm:px-0 lg:px-0">
        <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 lg:gap-16 w-full max-w-[100vw] px-4 sm:px-6 lg:px-32">
      <div className="flex flex-col gap-4 items-center text-center w-full">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-center leading-tight"
        >
          {t('hero.helpsBusinesses')}
        </motion.span>
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap relative px-3 sm:px-4 md:px-6 bg-primary text-primary-foreground text-4xl sm:text-5xl lg:text-7xl overflow-hidden py-1 sm:py-2 items-center justify-center text-center font-black shadow-xl leading-none"
        >
          <Typewriter 
            words={t('hero.words') as string[]}
            delayBetweenWords={2500}
          />
        </motion.div>
      </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 sm:gap-4 items-center justify-center w-full max-w-4xl text-center mx-auto px-2 sm:px-4"
        >
        <div className="text-sm md:text-base lg:text-lg font-medium leading-relaxed sm:leading-loose max-w-3xl mx-auto text-center w-full">
          <span className="font-mono text-primary bg-primary/10 rounded px-1.5 sm:px-2 py-0.5 text-sm sm:text-base md:text-lg inline-block mb-1 sm:mb-0 leading-tight">
            [ caio ]
          </span>
          {t('hero.subheadline.prefix')}
          <span className="bg-primary text-primary-foreground px-1.5 sm:px-2 py-0 rounded-sm inline-block mx-1 whitespace-normal leading-tight">
            {t('hero.subheadline.role')}
          </span>
          {t('hero.subheadline.middle')}
          <span className="bg-primary text-primary-foreground px-1.5 sm:px-2 py-0 rounded-sm inline-block mx-1 whitespace-normal leading-tight">
            {t('hero.subheadline.skill1')}
          </span>
          {t('hero.subheadline.comma1')}
          <span className="bg-primary text-primary-foreground px-1.5 sm:px-2 py-0 rounded-sm inline-block mx-1 whitespace-normal leading-tight">
            {t('hero.subheadline.skill2')}
          </span>
          {t('hero.subheadline.comma2')}
          <span className="bg-primary text-primary-foreground px-1.5 sm:px-2 py-0 rounded-sm inline-block mx-1 whitespace-normal leading-tight">
            {t('hero.subheadline.skill3')}
          </span>
          {t('hero.subheadline.suffix')}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-6 sm:mt-8 w-full px-2 sm:px-0">
          <TextureButton
            variant="primary"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() => setIsModalOpen(true)}
          >
            {t('hero.bookCall')} <span className="text-xs opacity-70 ml-2 hidden sm:inline-block">⌘K</span>
          </TextureButton>
          <TextureButton
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={() => window.open('https://rarityagency.io', '_blank')}
          >
            {t('hero.seeWork')}
          </TextureButton>
        </div>

        <div className="flex gap-2 items-center mt-4">
          <div className="relative shrink-0">
            <div className="absolute h-3 w-3 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
            <div className="h-3 w-3 bg-emerald-400 rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-sm">{t('hero.openForProjects')}</p>
        </div>
      </motion.div>

      {/* Marquee Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-[100vw] sm:max-w-5xl flex flex-col items-center mt-8 sm:mt-10 opacity-80 px-2 sm:px-0"
      >
        {/* Marquee Line for Ads */}
        <InteractiveMarquee speed={80} className="mt-2">
          <div className="flex items-center gap-3 sm:gap-4 text-zinc-800 dark:text-zinc-200 pr-12 sm:pr-24">
            <GoogleAds className="h-[40px] sm:h-[60px] w-auto shrink-0" />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight whitespace-nowrap">Google Ads</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-zinc-800 dark:text-zinc-200 pr-12 sm:pr-24">
            <SiMeta size={40} className="text-[#0668E1] sm:hidden shrink-0" />
            <SiMeta size={60} className="text-[#0668E1] hidden sm:block shrink-0" />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight whitespace-nowrap">Meta Ads</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-zinc-800 dark:text-zinc-200 pr-12 sm:pr-24">
            <SiTiktok size={40} className="text-[#000000] dark:text-white sm:hidden shrink-0" style={{ filter: "drop-shadow(2px 2px 0 #FE2C55) drop-shadow(-2px -2px 0 #25F4EE)" }} />
            <SiTiktok size={60} className="text-[#000000] dark:text-white hidden sm:block shrink-0" style={{ filter: "drop-shadow(2px 2px 0 #FE2C55) drop-shadow(-2px -2px 0 #25F4EE)" }} />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight whitespace-nowrap">TikTok Ads</span>
          </div>
        </InteractiveMarquee>
      </motion.div>
      </div>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </BackgroundImageTexture>
    </section>
  );
}
