"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import FOG from "vanta/dist/vanta.fog.min";

export function UnicornBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this only runs in the browser
    if (typeof window !== "undefined" && !vantaEffect && myRef.current) {
      try {
        setVantaEffect(
          FOG({
            el: myRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            highlightColor: 0x3a007a, // Much deeper violet, removing bright blue glow
            midtoneColor: 0x8a0b50,   // Darkened magenta/fuchsia
            lowlightColor: 0x190033,  // Very dark indigo (was creating the electric blue)
            baseColor: 0x000000,      // Pure black base
            blurFactor: 0.65,         // Soft smoky blur
            speed: 1.2,               // Smooth animation speed
            zoom: 0.8,                // Zooms out slightly for better volumetric depth
          })
        );
      } catch (e) {
        console.error("Vanta fog failed to initialize:", e);
      }
    }
    
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={myRef} 
      className="fixed inset-0 z-0 pointer-events-none bg-[#050010]"
    >
      {/* Noise overlay to add cinematic texture to the WebGL Fog */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      ></div>
    </div>
  );
}
