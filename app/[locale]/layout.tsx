import type { Metadata } from "next";
import "../globals.css";
import { Source_Sans_3, Roboto } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { monitorPerformance } from "../analytics";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });
const heading = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-heading" });

// Define supported locales
const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

// Generate metadata for each locale
export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = params.locale;
  
  // Localized metadata
  const metadata = {
    en: {
      title: "Caio de Camargo | AI Strategy Expert & Real Estate Investment Opportunities",
      description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation, business scaling, and exclusive real estate investment opportunities in Dubai, Bali, and Brazil. Book your free strategy consultation today.",
      keywords: [
        "AI Strategy Consultant",
        "Business Strategy Expert", 
        "Real Estate Investment Dubai",
        "Real Estate Investment Bali",
        "Real Estate Investment Brazil",
        "AI Business Solutions",
        "Digital Transformation",
        "Business Scaling Expert",
        "Strategy Consultation",
        "AI Implementation",
        "Business Growth",
        "Investment Opportunities"
      ]
    },
    pt: {
      title: "Caio de Camargo | Especialista em Estratégia com IA e Oportunidades de Investimento Imobiliário",
      description: "Transforme seu negócio com consultoria estratégica alimentada por IA. Orientação especializada em implementação de IA, escalonamento de negócios e oportunidades exclusivas de investimento imobiliário em Dubai, Bali e Brasil. Agende sua consultoria estratégica gratuita hoje.",
      keywords: [
        "Consultor de Estratégia com IA",
        "Especialista em Estratégia de Negócios",
        "Investimento Imobiliário Dubai",
        "Investimento Imobiliário Bali", 
        "Investimento Imobiliário Brasil",
        "Soluções de IA para Negócios",
        "Transformação Digital",
        "Especialista em Escalonamento de Negócios",
        "Consultoria Estratégica",
        "Implementação de IA",
        "Crescimento de Negócios",
        "Oportunidades de Investimento"
      ]
    },
    es: {
      title: "Caio de Camargo | Experto en Estrategia con IA y Oportunidades de Inversión Inmobiliaria",
      description: "Transforma tu negocio con consultoría estratégica impulsada por IA. Orientación experta en implementación de IA, escalado de negocios y oportunidades exclusivas de inversión inmobiliaria en Dubai, Bali y Brasil. Reserva tu consultoría estratégica gratuita hoy.",
      keywords: [
        "Consultor de Estrategia con IA",
        "Experto en Estrategia de Negocios",
        "Inversión Inmobiliaria Dubai",
        "Inversión Inmobiliaria Bali",
        "Inversión Inmobiliaria Brasil", 
        "Soluciones de IA para Negocios",
        "Transformación Digital",
        "Experto en Escalado de Negocios",
        "Consultoría Estratégica",
        "Implementación de IA",
        "Crecimiento de Negocios",
        "Oportunidades de Inversión"
      ]
    }
  };

  const currentMeta = metadata[locale];

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
          url: "https://caiodcamargo.com/caio-new-photo.jpg",
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
      images: ["https://caiodcamargo.com/caio-new-photo.jpg"],
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
        {/* Analytics script removed to fix import error */}
      </body>
    </html>
  );
}
