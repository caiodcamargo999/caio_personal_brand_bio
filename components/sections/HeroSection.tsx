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
      {/* Darkroom Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] sm:w-[850px] sm:h-[500px] bg-gradient-to-b from-[#ff4b17]/10 via-[#ff4b17]/[0.03] to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/[0.05] blur-[120px] rounded-full pointer-events-none -z-10" />

      <BackgroundImageTexture variant="grid-noise" opacity={0.35} className="relative w-full my-2 sm:my-4 lg:my-6 flex flex-col items-center justify-center pt-24 sm:pt-28 lg:pt-36 pb-8 sm:pb-12 px-0">
        <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 lg:gap-14 w-full max-w-[100vw] px-4 sm:px-6 lg:px-32">
          
          {/* Top Monospace Technical Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-full px-2"
          >
            <span className="font-mono text-[9.5px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.22em] text-zinc-300 bg-white/[0.04] border border-white/[0.1] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-md shadow-inner text-center whitespace-nowrap">
              [ GROWTH ARCHITECT // PAID MEDIA // AI ]
            </span>
          </motion.div>

          {/* Main Display Headline */}
          <div className="flex flex-col gap-3 sm:gap-5 items-center text-center w-full max-w-5xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-center leading-[1.12] sm:leading-[1.08] tracking-tight text-white"
            >
              {t('hero.helpsBusinesses')}
            </motion.span>
            
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex flex-wrap relative px-3 sm:px-6 md:px-8 bg-gradient-to-r from-zinc-900 via-[#141414] to-zinc-900 text-white border border-white/[0.12] rounded-xl text-2xl sm:text-5xl lg:text-7xl overflow-hidden py-1.5 sm:py-3 items-center justify-center text-center font-black shadow-2xl shadow-black/80 leading-none"
            >
              <Typewriter 
                words={t('hero.words') as string[]}
                delayBetweenWords={2500}
              />
            </motion.div>
          </div>

          {/* Subheadline Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-4 sm:gap-6 items-center justify-center w-full max-w-3xl text-center mx-auto px-2 sm:px-4"
          >
            <div className="text-sm sm:text-base lg:text-lg font-normal leading-relaxed sm:leading-loose text-zinc-300 text-center">
              <span className="font-mono text-zinc-200 bg-white/[0.08] border border-white/[0.12] rounded px-2 py-0.5 text-xs sm:text-sm mr-1.5 inline-block">
                [ caio de camargo ]
              </span>
              {t('hero.subheadline.prefix')}
              <span className="text-white font-medium bg-white/[0.08] border border-white/[0.1] px-1.5 py-0.5 rounded mx-1 inline whitespace-nowrap">
                {t('hero.subheadline.role')}
              </span>
              {t('hero.subheadline.middle')}
              <span className="text-white font-medium bg-white/[0.08] border border-white/[0.1] px-1.5 py-0.5 rounded mx-1 inline whitespace-nowrap">
                {t('hero.subheadline.skill1')}
              </span>
              {t('hero.subheadline.comma1')}
              <span className="text-white font-medium bg-white/[0.08] border border-white/[0.1] px-1.5 py-0.5 rounded mx-1 inline whitespace-nowrap">
                {t('hero.subheadline.skill2')}
              </span>
              {t('hero.subheadline.comma2')}
              <span className="text-white font-medium bg-white/[0.08] border border-white/[0.1] px-1.5 py-0.5 rounded mx-1 inline whitespace-nowrap">
                {t('hero.subheadline.skill3')}
              </span>
              {t('hero.subheadline.suffix')}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-3 sm:mt-6 w-full px-2 sm:px-0">
              <TextureButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[220px] shadow-xl shadow-white/5"
                onClick={() => setIsModalOpen(true)}
              >
                {t('hero.bookCall')} <span className="text-xs opacity-60 ml-2 hidden sm:inline-block font-mono">⌘K</span>
              </TextureButton>
              <TextureButton
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto min-w-[220px] border border-white/[0.12] hover:border-white/30"
                onClick={() => window.open('https://rarityagency.io', '_blank')}
              >
                {t('hero.seeWork')}
              </TextureButton>
            </div>

            {/* Availability Indicator */}
            <div className="flex items-center justify-center gap-2.5 mt-3 max-w-lg mx-auto text-center px-4">
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="absolute h-2.5 w-2.5 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                <div className="h-2 w-2 bg-emerald-400 rounded-full"></div>
              </div>
              <p className="text-zinc-400 font-mono text-[10px] sm:text-xs tracking-wider uppercase leading-snug">
                {t('hero.openForProjects')}
              </p>
            </div>
          </motion.div>

          {/* Marquee Ticker: Ads Platforms in Dark Glass Pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-[100vw] sm:max-w-5xl flex flex-col items-center mt-6 sm:mt-8 px-2 sm:px-0"
          >
            <InteractiveMarquee speed={70} className="py-2">
              <div className="flex items-center gap-3 bg-[#111111]/80 hover:bg-[#161616] border border-white/[0.08] hover:border-white/20 transition-all rounded-2xl py-3 px-6 text-zinc-200 mx-3 shadow-lg shadow-black/60">
                <GoogleAds className="h-[28px] sm:h-[34px] w-auto shrink-0" />
                <span className="text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap text-white">Google Ads</span>
              </div>
              <div className="flex items-center gap-3 bg-[#111111]/80 hover:bg-[#161616] border border-white/[0.08] hover:border-white/20 transition-all rounded-2xl py-3 px-6 text-zinc-200 mx-3 shadow-lg shadow-black/60">
                <SiMeta size={28} className="text-[#0668E1] shrink-0" />
                <span className="text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap text-white">Meta Ads</span>
              </div>
              <div className="flex items-center gap-3 bg-[#111111]/80 hover:bg-[#161616] border border-white/[0.08] hover:border-white/20 transition-all rounded-2xl py-3 px-6 text-zinc-200 mx-3 shadow-lg shadow-black/60">
                <SiTiktok size={28} className="text-white shrink-0" style={{ filter: "drop-shadow(2px 2px 0 #FE2C55) drop-shadow(-2px -2px 0 #25F4EE)" }} />
                <span className="text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap text-white">TikTok Ads</span>
              </div>
            </InteractiveMarquee>
          </motion.div>

        </div>
        <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </BackgroundImageTexture>
    </section>
  );
}
