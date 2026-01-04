"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface PrimaryGrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    icon?: React.ReactNode
    containerClassName?: string
}

export const PrimaryGrowButton = React.forwardRef<HTMLButtonElement, PrimaryGrowButtonProps>(
    ({ children, className, containerClassName, icon, ...props }, ref) => {
        return (
            <div className={cn("relative group/btn p-1", containerClassName)}>
                {/* Outer Container with Gradient Border */}
                <div className="relative rounded-full p-[3px] bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 shadow-[0_0_30px_rgba(139,92,246,0.4)] group-hover/btn:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-300">

                    {/* Inner Button */}
                    <button
                        ref={ref}
                        className={cn(
                            "relative w-full px-6 py-4 sm:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg text-white uppercase tracking-wide transition-all duration-300 group-hover/btn:scale-[1.01] flex items-center gap-3 justify-center overflow-hidden",
                            className
                        )}
                        {...props}
                    >
                        {/* Main Background Gradient */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600"></div>

                        {/* Grid Texture Overlay */}
                        <div className="absolute inset-0 rounded-full opacity-20" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
                        }}></div>

                        {/* Top Shine */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/5 to-transparent"></div>

                        {/* Bottom Reflection */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 via-transparent to-transparent"></div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-3">
                            {icon}
                            <span>{children}</span>
                        </div>
                    </button>
                </div>
            </div>
        )
    }
)

PrimaryGrowButton.displayName = "PrimaryGrowButton"
