import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
	title: "Caio de Camargo | Scale Your Business",
	description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation and business scaling. Book your free strategy consultation today.",
	icons: {
		icon: '/images/favicon_rarity.png',
	},
	keywords: [
		"AI Strategy Consultant",
		"Business Strategy Expert",
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
		title: "Caio de Camargo | Scale Your Business",
		description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation and business scaling.",
		siteName: "Caio de Camargo",
		images: [
			{
				url: "https://caiodcamargo.com/caio-profile-2026.jpg",
				width: 1200,
				height: 630,
				alt: "Caio de Camargo - AI Strategy Expert",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Caio de Camargo | Scale Your Business",
		description: "Transform your business with AI-powered strategy consulting. Expert guidance in AI implementation and business scaling.",
		images: ["https://caiodcamargo.com/caio-profile-2026.jpg"],
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
