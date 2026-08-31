"use client";

import React from "react";
import { CircuitBoard } from "@/components/ui/circuit-board";
import { MessageSquare, Lightbulb, Target, Rocket, CheckCircle2 } from "lucide-react";
import { BackgroundImageTexture } from "@/components/ui/bg-image-texture";
import { useI18n } from "@/lib/i18n";

export function ProcessSection() {
  const { t } = useI18n();

  return (
    <section className="w-full mt-16 sm:mt-24 lg:mt-32 mb-0 max-w-7xl mx-auto px-4 sm:px-6" id="process">
      <div className="relative w-full border border-white/[0.08] rounded-3xl bg-[#0d0d0d]/80 backdrop-blur-xl p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl shadow-black/80">
        
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#ff4b17]/[0.06] blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Text & Steps Content */}
          <div className="flex-1 z-10 flex flex-col gap-6 w-full lg:max-w-[52%]">
            
            {/* Top Monospace Tag */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1 rounded-full">
                [ 03 // EXECUTION FRAMEWORK ]
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              {t('process.title').split('Framework')[0]}
              <span className="text-white border-b-2 border-[#ff4b17] pb-0.5 inline-block">Framework</span>
              {t('process.title').split('Framework')[1]}
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
              {t('process.subtitle')}
            </p>
            
            {/* 3 Step Timeline Cards */}
            <div className="flex flex-col gap-4 mt-2">
              
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold text-white">01</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-base">{t('process.steps.briefing.title')}</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1 leading-relaxed">{t('process.steps.briefing.description')}</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold text-[#ff4b17]">02</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-base">{t('process.steps.brainstorm.title')}</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1 leading-relaxed">{t('process.steps.brainstorm.description')}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold text-emerald-400">03</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-base">{t('process.steps.execute.title')}</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1 leading-relaxed">{t('process.steps.execute.description')}</p>
                </div>
              </div>

              {/* Deliverable Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 pt-2">
                {(t('process.extraList') as string[]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-zinc-300 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#ff4b17] shrink-0" />
                    <span className="font-light">{item}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm font-mono text-zinc-400 uppercase tracking-wider pt-2 border-t border-white/[0.06]">
                {t('process.conclusion')}
              </p>
            </div>
          </div>

          {/* Circuit Board Visualization */}
          <div className="relative z-10 w-full lg:w-[48%] flex items-center justify-center p-4 sm:p-8 rounded-2xl bg-black/40 border border-white/[0.05] overflow-visible">
            <div className="w-full flex justify-center items-center">
              <CircuitBoard
                nodes={[
                  { id: "briefing", x: 90, y: 150, label: t('process.nodes.briefing'), icon: <MessageSquare className="w-4 h-4 text-white" /> },
                  { id: "brainstorm", x: 260, y: 75, label: t('process.nodes.brainstorm'), icon: <Lightbulb className="w-4 h-4 text-white" /> },
                  { id: "strategy", x: 260, y: 225, label: t('process.nodes.strategy'), icon: <Target className="w-4 h-4 text-white" /> },
                  { id: "execute", x: 430, y: 150, label: t('process.nodes.execute'), icon: <Rocket className="w-4 h-4 text-white" /> },
                ]}
                connections={[
                  { from: "briefing", to: "brainstorm", animated: true },
                  { from: "briefing", to: "strategy", animated: true },
                  { from: "brainstorm", to: "execute", animated: true },
                  { from: "strategy", to: "execute", animated: true },
                ]}
                width={520}
                height={300}
                traceColor="rgba(255, 75, 23, 0.35)"
                pulseColor="rgba(255, 255, 255, 1)"
                nodeColor="rgba(255, 255, 255, 0.9)"
                className="max-w-full h-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

