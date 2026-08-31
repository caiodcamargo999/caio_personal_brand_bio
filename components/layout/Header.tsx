"use client";

import React from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent pointer-events-none safe-area-top">
      <div className="lg:mx-10 flex h-16 sm:h-20 lg:h-24 items-center justify-end py-2 px-4 sm:px-6 md:px-0 pointer-events-auto">
        <div className="flex shrink-0 items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
