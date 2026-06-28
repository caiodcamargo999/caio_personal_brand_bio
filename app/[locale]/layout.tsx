import type { Metadata } from "next";
import "../globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { monitorPerformance } from "../analytics";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Define supported locales
const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

// Generate metadata for each locale
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = params.locale;

  // Localized metadata
  const metadata = {
    en: {
      title: "Caio de Camargo | Scale Your Business",
      description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation and business scaling. Book your free strategy consultation today.",
      keywords: [
        "Ads Management",
        "Marketing Agency",
        "Data Expert",
        "AI Specialist",
        "Website Specialist",
        "AI Strategy Consultant",
        "Business Strategy Expert",
        "Business Scaling Expert",
        "Digital Transformation",
        "Growth Marketing Agency",
        "Data Analytics Consultant"
      ]
    },
    pt: {
      title: "Caio de Camargo | Escale Seu Negócio",
      description: "Transforme seu negócio com consultoria estratégica alimentada por IA. Orientação especializada em implementação de IA e escalonamento de negócios. Agende sua consultoria estratégica gratuita hoje.",
      keywords: [
        "Gestão de Anúncios",
        "Agência de Marketing",
        "Especialista em Dados",
        "Especialista em IA",
        "Especialista em Sites",
        "Consultor de Estratégia com IA",
        "Especialista em Estratégia de Negócios",
        "Especialista em Escalonamento de Negócios",
        "Transformação Digital",
        "Agência de Growth Marketing",
        "Consultor de Análise de Dados"
      ]
    },
    es: {
      title: "Caio de Camargo | Escala Tu Negocio",
      description: "Transforma tu negocio con consultoría estratégica impulsada por IA. Orientación experta en implementación de IA y escalado de negocios. Reserva tu consultoría estratégica gratuita hoy.",
      keywords: [
        "Gestión de Anuncios",
        "Agencia de Marketing",
        "Experto en Datos",
        "Especialista en IA",
        "Especialista en Sitios Web",
        "Consultor de Estrategia con IA",
        "Experto en Estrategia de Negocios",
        "Experto en Escalado de Negocios",
        "Transformación Digital",
        "Agencia de Growth Marketing",
        "Consultor de Análisis de Datos"
      ]
    }
  };

  const currentMeta = metadata[locale] || metadata['en']; // Fallback to English if locale not found

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    authors: [{ name: "Caio de Camargo" }],
    creator: "Caio de Camargo",
    publisher: "Caio de Camargo",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US',
      url: `https://caiodcamargo.com/${locale}`,
      title: currentMeta.title,
      description: currentMeta.description,
      siteName: "Caio de Camargo",
      images: [
        {
          url: "https://caiodcamargo.com/caio-profile-2026.jpg",
          width: 1200,
          height: 630,
          alt: `Caio de Camargo - ${locale === 'pt' ? 'Especialista em Estratégia com IA' : locale === 'es' ? 'Experto en Estrategia con IA' : 'AI Strategy Expert'}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentMeta.title,
      description: currentMeta.description,
      images: ["https://caiodcamargo.com/caio-profile-2026.jpg"],
      creator: "@caiodcamargo",
    },
    alternates: {
      canonical: `https://caiodcamargo.com/${locale}`,
      languages: {
        "en": "https://caiodcamargo.com/en",
        "pt": "https://caiodcamargo.com/pt",
        "es": "https://caiodcamargo.com/es",
      },
    },
    metadataBase: new URL("https://caiodcamargo.com"),
  };
}

import { ThemeProvider } from "@/components/ThemeProvider";
import { UnicornBackground } from "@/components/UnicornBackground";

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
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen min-h-[100dvh] text-foreground antialiased font-sans w-full max-w-[100vw]">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <I18nProvider initialLocale={locale}>
            <UnicornBackground />
            <div className="relative z-10">
              {children}
            </div>
            <Analytics />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

