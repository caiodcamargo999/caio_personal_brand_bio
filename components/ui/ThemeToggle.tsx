"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-12 h-12 transition-all hover:scale-105 border 
                 bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 shadow-[0_0_25px_rgba(250,204,21,0.5)] border-yellow-300/50 
                 dark:bg-none dark:bg-blue-950/40 dark:text-blue-400 dark:shadow-[0_0_25px_rgba(59,130,246,0.2)] dark:border-blue-500/30"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-6 w-6 block dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
