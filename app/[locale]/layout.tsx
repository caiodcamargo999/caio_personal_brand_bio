import type { Metadata } from "next";
import "../globals.css";
import { Source_Sans_3, Roboto } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { notFound } from "next/navigation";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });
const heading = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-heading" });

// Define supported locales
const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

// Generate metadata for each locale
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return {
    title: "Caio de Camargo | Link Bio",
    description: "Helping you grow with AI, Strategy & Business.",
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    openGraph: {
      title: 'Caio de Camargo | Link Bio',
      description: 'Helping you grow with AI, Strategy & Business.',
      type: 'website',
      locale: params.locale,
    },
    icons: {
      shortcut: '/favicon.ico',
    },
  };
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${sans.variable} ${heading.variable}`}>
      <body className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.08)_0%,transparent_50%),linear-gradient(135deg,#0a0a0a_0%,#1a0a1a_25%,#0f0a1f_50%,#1a0a2a_75%,#0a0a0a_100%)] text-white antialiased font-sans">
        <I18nProvider initialLocale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
