"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function InteractiveMarquee({
  children,
  speed = 50, // pixels per second
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const baseX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const xStart = useRef(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const child = containerRef.current.children[0] as HTMLElement;
        if (child) {
          setContentWidth(child.offsetWidth);
        }
      }
    };
    updateWidth();
    // Use a small timeout to ensure fonts/images are loaded
    setTimeout(updateWidth, 500);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [children]);

  useAnimationFrame((t, delta) => {
    if (contentWidth === 0 || isDragging.current) return;
    let moveBy = speed * (delta / 1000);
    if (reverse) moveBy = -moveBy;
    const newX = wrap(-contentWidth, 0, baseX.get() - moveBy);
    baseX.set(newX);
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = e.clientX;
    xStart.current = baseX.get();
  };

  const handlePointerMove = (e: WindowEventMap["pointermove"]) => {
    if (!isDragging.current || contentWidth === 0) return;
    const delta = e.clientX - dragStart.current;
    // Multiplier for "faster" feel when dragging
    const newX = wrap(-contentWidth, 0, xStart.current + delta * 1.5);
    baseX.set(newX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [contentWidth]);

  return (
    <div
      className={cn(
        "overflow-hidden flex w-full cursor-grab active:cursor-grabbing select-none",
        className
      )}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "pan-y" }} // Prevent horizontal scroll on mobile, allow vertical
    >
      <motion.div
        className="flex"
        style={{ x: baseX }}
        ref={containerRef}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </motion.div>
    </div>
  );
}
