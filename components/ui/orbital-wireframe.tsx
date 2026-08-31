"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface OrbitalWireframeProps {
  activeIndex: number;
  services: Array<{ title: string; id: string }>;
}

export function OrbitalWireframe({ activeIndex, services }: OrbitalWireframeProps) {
  const activeService = services[activeIndex] || services[0];

  // Colors & rotation angles associated with each step
  const stepConfigs = [
    { rotateX: 62, rotateY: 18, rotateZ: 15, badgeX: 180, badgeY: 100, color: "#ff4b17" },
    { rotateX: 45, rotateY: 55, rotateZ: -25, badgeX: 170, badgeY: 150, color: "#f000d0" },
    { rotateX: 70, rotateY: -35, rotateZ: 40, badgeX: 190, badgeY: 180, color: "#0668E1" },
    { rotateX: 30, rotateY: 70, rotateZ: 60, badgeX: 175, badgeY: 220, color: "#10A37F" },
  ];

  const currentConfig = stepConfigs[activeIndex % stepConfigs.length];

  return (
    <div className="relative w-full aspect-square max-w-[420px] lg:max-w-[480px] flex items-center justify-center pointer-events-none select-none">
      
      {/* Deep ambient sphere glow */}
      <div 
        className="absolute w-[240px] h-[240px] rounded-full blur-[80px] opacity-25 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: currentConfig.color }}
      />

      {/* SVG 3D Wireframe Sphere */}
      <div className="relative w-[340px] h-[340px] flex items-center justify-center">
        
        {/* Outer Circular Boundary */}
        <div className="absolute inset-0 rounded-full border border-white/[0.08] shadow-inner" />

        {/* Ring 1 (Horizontal tilted orbit) */}
        <motion.div
          animate={{
            rotateX: currentConfig.rotateX,
            rotateY: currentConfig.rotateY,
            rotateZ: [0, 360],
          }}
          transition={{
            rotateZ: { duration: 24, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 0.8, ease: "easeInOut" },
            rotateY: { duration: 0.8, ease: "easeInOut" },
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute w-full h-full rounded-full border border-white/20"
        />

        {/* Ring 2 (Vertical tilted orbit) */}
        <motion.div
          animate={{
            rotateX: currentConfig.rotateX + 45,
            rotateY: currentConfig.rotateY - 40,
            rotateZ: [360, 0],
          }}
          transition={{
            rotateZ: { duration: 32, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 0.8, ease: "easeInOut" },
            rotateY: { duration: 0.8, ease: "easeInOut" },
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute w-[92%] h-[92%] rounded-full border border-white/15"
        />

        {/* Ring 3 (Diagonal active highlight orbit) */}
        <motion.div
          animate={{
            rotateX: -currentConfig.rotateX + 20,
            rotateY: currentConfig.rotateY + 60,
            rotateZ: [0, 360],
          }}
          transition={{
            rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 0.8, ease: "easeInOut" },
            rotateY: { duration: 0.8, ease: "easeInOut" },
          }}
          style={{ 
            transformStyle: "preserve-3d",
            borderColor: `${currentConfig.color}90`,
            boxShadow: `0 0 15px ${currentConfig.color}40`,
          }}
          className="absolute w-[80%] h-[80%] rounded-full border-2 transition-colors duration-500"
        />

        {/* Center Nucleus / Core */}
        <div className="absolute w-3 h-3 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

        {/* Dynamic Connected Badge (Darkroom reference style) */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-20 pointer-events-auto"
        >
          {/* Connector Line */}
          <div 
            className="w-12 h-[1px] transition-colors duration-500"
            style={{ backgroundColor: currentConfig.color }}
          />

          {/* Connected Badge Pill */}
          <div className="flex items-center gap-2 bg-[#090909]/95 border border-white/20 rounded-full py-1.5 px-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300">
            <span 
              className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-black"
              style={{ backgroundColor: currentConfig.color }}
            >
              {activeIndex + 1}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-white whitespace-nowrap">
              {activeService.title.toLowerCase()}
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
