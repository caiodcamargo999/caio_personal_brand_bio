"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useI18n();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setLocale(newLocale as any);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-auto px-3 py-2 bg-card/80 backdrop-blur-sm border border-cardBorder hover:bg-card/90 hover:border-primary/30 transition-all duration-200 rounded-lg text-white hover:text-white"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline text-sm font-medium">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
          <span className="sm:hidden text-sm font-medium">
            {currentLanguage.flag}
          </span>
          <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-card/95 backdrop-blur-xl border border-cardBorder rounded-lg shadow-xl"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
              locale === language.code
                ? "bg-primary/20 text-white border-l-2 border-primary"
                : "text-muted hover:text-white hover:bg-card/50"
            }`}
          >
            <span className="text-lg mr-3">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
            {locale === language.code && (
              <span className="ml-auto text-primary text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
