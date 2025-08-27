import type { Metadata } from "next";
import "./globals.css";
import { Source_Sans_3, Roboto } from "next/font/google";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });
const heading = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
	title: "Caio de Camargo | Link Bio",
	description: "Helping you grow with AI, Strategy & Business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
