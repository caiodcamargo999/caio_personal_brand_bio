"use client";

import React from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export function Header() {
  const { t, locale } = useI18n();

  const availabilityText = {
    en: "OPEN FOR CLIENTS",
    pt: "VAGAS ABERTAS",
    es: "CUPOS ABIERTOS",
  }[locale] || "OPEN FOR CLIENTS";

  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-fit max-w-[calc(100vw-1.5rem)] flex items-center justify-center safe-area-top">
      <div className="flex items-center justify-center gap-2 sm:gap-4 bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/[0.12] rounded-full py-1 px-3 sm:px-4 shadow-2xl shadow-black/90 pointer-events-auto transition-all duration-300 hover:border-white/25">
        {/* Availability Badge */}
        <div className="flex items-center gap-2 pr-1 sm:pr-2 py-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[9.5px] sm:text-[11px] font-medium tracking-[0.14em] sm:tracking-[0.16em] uppercase text-zinc-300 whitespace-nowrap">
            {availabilityText}
          </span>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-3.5 bg-white/10" />

        {/* Language Switcher */}
        <div className="flex shrink-0 items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

