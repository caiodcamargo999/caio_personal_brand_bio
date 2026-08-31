"use client";

import React from "react";
import { TrendingUp, LineChart, Target, Users, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function ServicesSection() {
  const { t } = useI18n();

  const icons = [
    <Target key="target" className="w-5 h-5 text-white" />,
    <TrendingUp key="trending" className="w-5 h-5 text-white" />,
    <Users key="users" className="w-5 h-5 text-white" />,
    <LineChart key="linechart" className="w-5 h-5 text-white" />
  ];

  const services = t('services.items') as Array<{ title: string, description: string }>;

  return (
    <section className="flex flex-col gap-6 mt-20 sm:mt-28 lg:mt-36 px-4 sm:px-6 max-w-7xl mx-auto w-full" id="services">
      
      {/* Header Tag */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1 rounded-full">
          [ 02 // CORE CAPABILITIES ]
        </span>

        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mt-1">
          {/* Render highlight based on language */}
          {t('services.title').includes('Unfair Advantage') ? (
            <>
              {t('services.title').split('Unfair Advantage')[0]}
              <span className="text-white border-b-2 border-[#ff4b17] pb-0.5 inline-block">Unfair Advantage</span>
              {t('services.title').split('Unfair Advantage')[1]}
            </>
          ) : t('services.title').includes('Vantagem Injusta') ? (
            <>
              {t('services.title').split('Vantagem Injusta')[0]}
              <span className="text-white border-b-2 border-[#ff4b17] pb-0.5 inline-block">Vantagem Injusta</span>
              {t('services.title').split('Vantagem Injusta')[1]}
            </>
          ) : t('services.title').includes('Ventaja Injusta') ? (
            <>
              {t('services.title').split('Ventaja Injusta')[0]}
              <span className="text-white border-b-2 border-[#ff4b17] pb-0.5 inline-block">Ventaja Injusta</span>
              {t('services.title').split('Ventaja Injusta')[1]}
            </>
          ) : (
            t('services.title')
          )}
        </h2>

        <p className="text-zinc-400 text-center text-base sm:text-lg font-light max-w-2xl mx-auto mt-2">
          {t('services.subtitle')}
        </p>
      </div>
      
      {/* Spotlight Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8 sm:mt-12 w-full">
        {services.map((service, index) => (
          <SpotlightCard
            key={index}
            className="p-6 sm:p-8 flex flex-col justify-between min-h-[230px] group cursor-default"
            spotlightColor="rgba(255, 75, 23, 0.12)"
          >
            {/* Top row: Number & Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-[#ff4b17] bg-[#ff4b17]/10 border border-[#ff4b17]/20 rounded-md px-2 py-0.5">
                  0{index + 1}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shadow-inner group-hover:border-white/25 transition-colors">
                  {icons[index]}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:border-white/30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
                {service.title}
              </h3>
              <p className="text-zinc-400 mt-3 text-sm sm:text-base font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

