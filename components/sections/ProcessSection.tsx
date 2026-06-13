"use client";

import React from "react";
import { CircuitBoard } from "@/components/ui/circuit-board";
import { MessageSquare, Lightbulb, Target, Rocket } from "lucide-react";
import { BackgroundImageTexture } from "@/components/ui/bg-image-texture";
import { useI18n } from "@/lib/i18n";

export function ProcessSection() {
  const { t } = useI18n();

  return (
    <section className="w-full mt-8 sm:mt-10 lg:mt-16 mb-0" id="process">
      <BackgroundImageTexture variant="grid-noise" opacity={0.2} className="relative w-full">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between py-10 sm:py-16 px-4 sm:px-6 lg:px-8 gap-8 sm:gap-12">
        
        {/* Text Content */}
        <div className="flex-1 z-10 flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            {t('process.title').split('Framework')[0]}
            <span className="bg-primary text-primary-foreground px-2 py-1 inline-block rounded">Framework</span>
            {t('process.title').split('Framework')[1]}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed max-w-md">
            {t('process.subtitle')}
          </p>
          
          <div className="flex flex-col gap-8 mt-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-white font-medium">1. {t('process.steps.briefing.title')}</h4>
                <p className="text-muted-foreground text-sm">{t('process.steps.briefing.description')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-white font-medium">2. {t('process.steps.brainstorm.title')}</h4>
                <p className="text-muted-foreground text-sm">{t('process.steps.brainstorm.description')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                <Rocket className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-white font-medium">3. {t('process.steps.execute.title')}</h4>
                <p className="text-muted-foreground text-sm">{t('process.steps.execute.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Circuit Board Visualization */}
        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.65] sm:scale-100 md:scale-125 transform">
            <CircuitBoard
              nodes={[
                { id: "briefing", x: 75, y: 150, label: t('process.nodes.briefing'), icon: <MessageSquare className="w-4 h-4" /> },
                { id: "brainstorm", x: 275, y: 80, label: t('process.nodes.brainstorm'), icon: <Lightbulb className="w-4 h-4" /> },
                { id: "strategy", x: 275, y: 220, label: t('process.nodes.strategy'), icon: <Target className="w-4 h-4" /> },
                { id: "execute", x: 475, y: 150, label: t('process.nodes.execute'), icon: <Rocket className="w-4 h-4" /> },
              ]}
              connections={[
                { from: "briefing", to: "brainstorm", animated: true },
                { from: "briefing", to: "strategy", animated: true },
                { from: "brainstorm", to: "execute", animated: true },
                { from: "strategy", to: "execute", animated: true },
              ]}
              width={550}
              height={300}
              traceColor="rgba(215, 215, 220, 0.5)"
              pulseColor="rgba(255, 255, 255, 1)"
              nodeColor="rgba(230, 230, 240, 0.9)"
            />
          </div>
        </div>

        </div>
      </BackgroundImageTexture>
    </section>
  );
}
