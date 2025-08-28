import type { Metadata } from "next";
import "./globals.css";
import { Source_Sans_3, Roboto } from "next/font/google";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });
const heading = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
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
		"Investment Opportunities",
		"Caio de Camargo",
		"Rarity Agency"
	],
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
		locale: "en_US",
		url: "https://caiodcamargo.com",
		title: "Caio de Camargo | AI Strategy Expert & Real Estate Investment Opportunities",
		description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation, business scaling, and exclusive real estate investment opportunities in Dubai, Bali, and Brazil.",
		siteName: "Caio de Camargo",
		images: [
			{
				url: "https://caiodcamargo.com/caio-new-photo.jpg",
				width: 1200,
				height: 630,
				alt: "Caio de Camargo - AI Strategy Expert",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Caio de Camargo | AI Strategy Expert & Real Estate Investment Opportunities",
		description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation, business scaling, and exclusive real estate investment opportunities.",
		images: ["https://caiodcamargo.com/caio-new-photo.jpg"],
		creator: "@caiodcamargo",
	},
	alternates: {
		canonical: "https://caiodcamargo.com",
		languages: {
			"en": "https://caiodcamargo.com/en",
			"pt": "https://caiodcamargo.com/pt",
			"es": "https://caiodcamargo.com/es",
		},
	},
	metadataBase: new URL("https://caiodcamargo.com"),
	verification: {
		google: "your-google-verification-code", // Add your Google Search Console verification code
	},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
