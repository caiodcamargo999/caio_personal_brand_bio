import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";

export const metadata: Metadata = {
	title: "Caio de Camargo | Link Bio",
	description: "Helping you grow with AI, Strategy & Business.",
};

export default async function LocaleLayout({
	children,
	params: { locale }
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.08)_0%,transparent_50%),linear-gradient(135deg,#0a0a0a_0%,#1a0a1a_25%,#0f0a1f_50%,#1a0a2a_75%,#0a0a0a_100%)] text-white antialiased">
				<NextIntlClientProvider messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
