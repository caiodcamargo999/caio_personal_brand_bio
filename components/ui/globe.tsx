"use client";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], 
      markerColor: [1, 0.5, 0.1], // Orange markers like screenshot
      glowColor: [1, 1, 1], // White glow
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.0060], size: 0.1 },
        { location: [-23.5505, -46.6333], size: 0.1 }, // Brazil
        { location: [25.2048, 55.2708], size: 0.1 }, // Dubai
        { location: [-8.4095, 115.1889], size: 0.1 } // Bali
      ],
      // @ts-ignore
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', contain: 'layout paint size', opacity: 1, transition: 'opacity 1s ease' }}
      />
    </div>
  );
}
