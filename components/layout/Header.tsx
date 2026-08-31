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
    <header className="fixed top-4 sm:top-6 z-50 w-full flex justify-center pointer-events-none px-4 safe-area-top">
      <div className="flex items-center justify-between gap-3 sm:gap-6 bg-[#0d0d0d]/85 backdrop-blur-xl border border-white/[0.1] rounded-full py-1.5 px-3 sm:px-4 shadow-2xl shadow-black/80 pointer-events-auto transition-all duration-300 hover:border-white/20">
        {/* Availability Badge */}
        <div className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-zinc-300 whitespace-nowrap">
            {availabilityText}
          </span>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />

        {/* Language Switcher */}
        <div className="flex shrink-0 items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

