"use client";

import React, { useState } from "react";
import { Globe } from "@/components/ui/globe";
import { TextureButton } from "@/components/ui/texture-button";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";

export function GlobalOperationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 mt-20 overflow-hidden border border-border/40 rounded-3xl bg-black/40 backdrop-blur-sm min-h-[500px]">
      
      {/* Text Content */}
      <div className="flex-1 p-8 md:p-16 z-10">
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
          Caio Operates <span className="bg-white text-black px-2 py-1 rounded inline-block">24/7</span>.<br />
          That&apos;s How We Scale Fast.
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-lg mb-8 leading-relaxed font-light">
          We work <span className="bg-white/10 text-white px-1.5 py-0.5 rounded">24/7</span> to help you scale your business seamlessly. Our elite remote teams are spread across the globe, ensuring we are available <span className="bg-white/10 text-white px-1.5 py-0.5 rounded">anytime</span> and <span className="bg-white/10 text-white px-1.5 py-0.5 rounded">anywhere</span>.
        </p>

        <TextureButton variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
          Book a Call <span className="text-xs opacity-70 ml-2">⌘K</span>
        </TextureButton>
      </div>

      {/* Globe Container */}
      <div className="absolute right-[-20%] md:right-[-30%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-80 pointer-events-none hidden md:block">
        <Globe className="w-full h-full" />
      </div>

      {/* Mobile Globe */}
      <div className="relative w-[500px] h-[500px] mt-8 opacity-80 pointer-events-none md:hidden -ml-[100px]">
        <Globe className="w-full h-full" />
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
