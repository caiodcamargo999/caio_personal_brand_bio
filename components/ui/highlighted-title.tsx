import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HighlightedTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  animated?: boolean;
}

const highlightedTitleVariants = {
  primary: "bg-gradient-to-r from-primary-600/20 via-primary-500/20 to-primary-600/20 border border-primary/30",
  secondary: "bg-gradient-to-r from-card/80 to-cardBorder/60 border border-cardBorder/50",
  accent: "bg-gradient-to-r from-accent-600/20 via-accent-500/20 to-accent-600/20 border border-accent/30",
};

const highlightedTitleSizes = {
  sm: "text-sm px-2 py-1",
  md: "text-base px-3 py-1.5",
  lg: "text-lg px-4 py-2",
  xl: "text-xl px-5 py-2.5",
};

export const HighlightedTitle = React.forwardRef<HTMLHeadingElement, HighlightedTitleProps>(
  ({ 
    className, 
    as: Component = "h2", 
    variant = "primary", 
    size = "md", 
    glow = false,
    animated = true,
    children, 
    ...props 
  }, ref) => {
    const titleClasses = cn(
      "inline-block font-semibold tracking-tight rounded-md backdrop-blur-sm",
      highlightedTitleVariants[variant],
      highlightedTitleSizes[size],
      glow && "shadow-glow",
      className
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Component
            ref={ref}
            className={titleClasses}
            {...props}
          >
            {children}
          </Component>
        </motion.div>
      );
    }

    return (
      <Component
        ref={ref}
        className={titleClasses}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

HighlightedTitle.displayName = "HighlightedTitle";
