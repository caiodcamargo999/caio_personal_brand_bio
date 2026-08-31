"use client";

import Image from "next/image";
import photo from "/caio-profile-2026.jpg";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LinkedInLogo } from "@/components/icons/LinkedInLogo";
import { InstagramLogo } from "@/components/icons/InstagramLogo";
import { XLogo } from "@/components/icons/XLogo";
import { BrainIcon } from "@/components/icons/BrainIcon";
import { PhoneChartIcon } from "@/components/icons/PhoneChartIcon";
import { Button } from "@/components/ui/button";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { NeuralButton } from "@/components/ui/neural-button";
import { Card, CardContent } from "@/components/ui/card";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";

export default function BioPage() {
	const { t, locale } = useI18n();
	const router = useRouter();
	const pathname = usePathname();
	const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);



	const listVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.14 }
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 12 },
		show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
	};

	return (
		<main className="relative z-10 mx-auto max-w-[720px] w-full px-4 py-4 sm:py-6 md:py-8 lg:py-12">
			{/* Language Switcher - Top Right */}
			<div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 z-20">
				<LanguageSwitcher />
			</div>

			<header className="mb-6 sm:mb-8 md:mb-10 text-center">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-4 sm:space-y-6"
				>
					<Image
						src={photo}
						alt="Caio de Camargo's Profile Photo"
						width={140}
						height={140}
						className="mx-auto h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px] rounded-full border-[3px] border-cardBorder bg-cardBorder object-cover object-[60%_40%] shadow-[0_4px_15px_rgba(0,0,0,0.2),0_0_20px_rgba(139,92,246,0.1)]"
						priority
						unoptimized
						onError={(e) => {
							console.error('Image failed to load:', e);
						}}
					/>
					<div className="space-y-3 sm:space-y-4">
						<h1 className="bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-2xl font-bold tracking-[-0.03em] text-transparent sm:text-3xl md:text-5xl lg:text-[3.5rem] sm:leading-tight">
							{t('hero.title')}
						</h1>
						<p className="mx-auto max-w-[520px] text-balance text-sm sm:text-base md:text-lg font-normal leading-relaxed text-muted px-2 sm:px-4">
							{t('hero.subtitle')}
						</p>
					</div>
				</motion.div>
			</header>

			{/* Main cards section with optimized spacing */}
			<section className="mb-6 sm:mb-8 md:mb-10">
				<motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-4 sm:space-y-5 md:space-y-6">
					{/* 1) Strategy & Consultation first */}
					<Card
						className="group cursor-pointer overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 hover:from-primary/15 hover:to-black/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
						onClick={() => setIsLeadModalOpen(true)}
					>
						<motion.div variants={itemVariants} className="p-6 sm:p-7 md:p-8">
							<CardContent className="p-0 space-y-4">
								{/* Botão estilo "QUERO TER UMA MÁQUINA MILIONÁRIA" */}
								<NeuralButton icon={<BrainIcon size={18} />}>
									{t('cards.strategyConsultation.title')}
								</NeuralButton>

								{/* Descrição */}
								<p className="text-sm sm:text-base text-muted leading-relaxed text-center">
									{t('cards.strategyConsultation.description')}
								</p>
							</CardContent>
						</motion.div>
					</Card>

					{/* 2) Rarity Agency second */}
					<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 hover:from-primary/15 hover:to-black/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
						<motion.div variants={itemVariants}>
							<a href="https://rarityagency.io" className="block p-6 sm:p-7 md:p-8">
								<CardContent className="p-0 space-y-4">
									{/* Botão estilo "QUERO TER UMA MÁQUINA MILIONÁRIA" */}
									<NeuralButton icon={<PhoneChartIcon size={18} />}>
										{t('cards.rarityAgency.title')}
									</NeuralButton>

									{/* Descrição */}
									<p className="text-sm sm:text-base text-muted leading-relaxed text-center">
										{t('cards.rarityAgency.description')}
									</p>
								</CardContent>
							</a>
						</motion.div>
					</Card>



				</motion.div>
			</section>

			{/* Value proposition section with reduced spacing */}
			<section className="mb-6 sm:mb-8 md:mb-10 rounded-xl border border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 p-6 sm:p-7 md:p-8 text-center backdrop-blur-sm">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="space-y-4"
				>
					<p className="mx-auto max-w-[500px] text-balance text-sm sm:text-base font-medium text-muted leading-relaxed">
						{t('valueProposition.description')}
					</p>
				</motion.div>
			</section>

			{/* Footer with social media icons */}
			<footer className="pb-4 sm:pb-5 text-center">
				<div className="mb-3 flex items-center justify-center gap-4 sm:gap-5 md:gap-6 text-muted">
					<a href="https://www.linkedin.com/in/caiodecamargo/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-white transition-colors">
						<LinkedInLogo size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
					</a>
					<a href="https://www.instagram.com/caiodcamargo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="hover:text-white transition-colors">
						<InstagramLogo size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
					</a>
					<a href="https://x.com/caiodcamargo" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter Profile" className="hover:text-white transition-colors">
						<XLogo size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
					</a>
				</div>
				<p className="text-xs sm:text-sm text-muted">{t('footer.copyright')}</p>
			</footer>

			{/* Lead Capture Modal */}
			<LeadCaptureModal
				isOpen={isLeadModalOpen}
				onClose={() => setIsLeadModalOpen(false)}
			/>
		</main>
	);
}
