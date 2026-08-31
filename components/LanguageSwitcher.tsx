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
          variant="outline"
          size="sm"
          className="h-9 w-auto px-3 py-2 bg-background backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md"
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
        className="w-48 bg-background border-border rounded-md shadow-lg"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
              locale === language.code
                ? "bg-accent text-accent-foreground font-semibold"
                : "text-muted-foreground hover:text-accent-foreground hover:bg-accent"
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
