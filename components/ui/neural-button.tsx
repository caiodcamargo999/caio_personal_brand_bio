"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NeuralButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    icon?: React.ReactNode
    containerClassName?: string
    variant?: "primary" | "secondary"
}

export const NeuralButton = React.forwardRef<HTMLButtonElement, NeuralButtonProps>(
    ({ children, className, containerClassName, icon, variant = "primary", ...props }, ref) => {
        return (
            <motion.div
                className={cn("relative group/btn p-[1px] rounded-full", containerClassName)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* External Glow / Aura */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 opacity-40 group-hover/btn:opacity-80 blur-lg transition-all duration-500 group-hover/btn:blur-xl" />

                {/* Moving Border Gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_auto] animate-shimmer opacity-100 p-[2px]" />

                {/* The Actual Button */}
                <button
                    ref={ref}
                    className={cn(
                        "relative w-full px-6 py-2 sm:py-2.5 rounded-full overflow-hidden transition-all duration-300",
                        "bg-[#1a0b2e] hover:bg-[#250e41]",
                        "border border-white/10",
                        "flex items-center justify-center gap-2 sm:gap-3",
                        "text-white font-bold tracking-wide uppercase text-xs sm:text-sm",
                        className
                    )}
                    {...props}
                >
                    {/* Neural Network Background Pattern - animated via CSS */}
                    <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover/btn:opacity-30">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                        {/* Random glowing nodes effect could go here, but keeping it performant with CSS gradients */}
                    </div>

                    {/* Scanning Light Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/btn:animate-scan" />

                    {/* Inner Content Layers */}

                    {/* Bottom Highlight */}
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                        {icon && <span className="text-violet-400 group-hover/btn:text-violet-300 transition-colors">{icon}</span>}
                        <span className="bg-gradient-to-r from-white via-violet-100 to-white bg-clip-text text-transparent group-hover/btn:text-white transition-all shadow-sm">
                            {children}
                        </span>
                    </div>
                </button>
            </motion.div>
        )
    }
)

NeuralButton.displayName = "NeuralButton"
