"use client";

import Image from "next/image";
import photo from "@/public/caio-new-photo.jpg";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LinkedInLogo } from "@/components/icons/LinkedInLogo";
import { InstagramLogo } from "@/components/icons/InstagramLogo";
import { XLogo } from "@/components/icons/XLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";

export default function HomePage() {
	const { t, locale } = useI18n();
	const router = useRouter();
	const pathname = usePathname();
	const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

	const handleSelectCountry = (country: string) => {
		const message = `Hey Caio, I want to know about opportunities on Real Estate in ${country}`;
		const whatsappUrl = `https://wa.me/5551993288772?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	};

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

			<header className="mb-4 sm:mb-6 md:mb-8 text-center">
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<Image
						src={photo}
						alt="Caio de Camargo's Profile Photo"
						width={120}
						height={120}
						className="mx-auto mb-3 h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[120px] md:w-[120px] rounded-full border-[3px] border-cardBorder bg-cardBorder object-cover object-[center_25%] shadow-[0_4px_15px_rgba(0,0,0,0.2),0_0_20px_rgba(139,92,246,0.1)]"
						priority
					/>
					<h1 className="bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-xl font-bold tracking-[-0.03em] text-transparent sm:text-2xl md:text-4xl lg:text-[3.2rem] sm:leading-tight mb-2 sm:mb-3 md:mb-4 pb-2">
						{t('hero.title')}
					</h1>
					<p className="mx-auto max-w-[520px] text-balance text-sm sm:text-base md:text-lg font-normal leading-relaxed text-muted px-2 sm:px-4">
						{t('hero.subtitle')}
					</p>
				</motion.div>
			</header>

			{/* Main cards section with optimized spacing */}
			<section className="mb-6 sm:mb-8 md:mb-10">
				<motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-3 sm:space-y-4 md:space-y-5">
					{/* 1) Strategy & Consultation first */}
					<Card 
						className="group cursor-pointer overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 hover:from-primary/15 hover:to-black/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
						onClick={() => setIsLeadModalOpen(true)}
					>
						<motion.div variants={itemVariants} className="px-4 py-5 sm:px-6 sm:py-6 md:py-7">
							<CardContent className="p-0">
								<h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-[-0.02em]">{t('cards.strategyConsultation.title')}</h2>
								<p className="mt-2 text-sm text-muted leading-relaxed">
									{t('cards.strategyConsultation.description')}
								</p>
								<span className="mt-3 sm:mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">
									{t('cards.strategyConsultation.cta')}
								</span>
							</CardContent>
						</motion.div>
					</Card>

					{/* 2) Real Estate Opportunities second */}
					<Dialog>
						<DialogTrigger asChild>
							<Card className="group cursor-pointer overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 hover:from-primary/20 hover:to-black/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/60">
								<motion.div className="px-4 py-5 sm:px-6 sm:py-6 md:py-7" variants={itemVariants}>
									<CardContent className="p-0">
										<h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-[-0.02em]">{t('cards.realEstate.title')}</h2>
										<p className="mt-2 text-sm text-muted leading-relaxed">{t('cards.realEstate.description')}</p>
										<span className="mt-3 sm:mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">{t('cards.realEstate.cta')}</span>
									</CardContent>
								</motion.div>
							</Card>
						</DialogTrigger>
						<DialogContent className="max-w-[520px] border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl">
							<DialogHeader>
								<DialogTitle className="bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">{t('realEstate.dialogTitle')}</DialogTitle>
								<DialogDescription className="text-muted">{t('realEstate.dialogDescription')}</DialogDescription>
							</DialogHeader>
							<div className="grid gap-3">
								<Card onClick={() => handleSelectCountry(t('realEstate.countries.indonesia.name'))} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
									<CardContent className="p-4 sm:p-5">
										<p className="text-sm sm:text-base font-semibold">{t('realEstate.countries.indonesia.name')}</p>
										<p className="mt-1 text-xs sm:text-sm text-muted">{t('realEstate.countries.indonesia.description')}</p>
									</CardContent>
								</Card>
								<Card onClick={() => handleSelectCountry(t('realEstate.countries.dubai.name'))} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
									<CardContent className="p-4 sm:p-5">
										<p className="text-sm sm:text-base font-semibold">{t('realEstate.countries.dubai.name')}</p>
										<p className="mt-1 text-xs sm:text-sm text-muted">{t('realEstate.countries.dubai.description')}</p>
									</CardContent>
								</Card>
								<Card onClick={() => handleSelectCountry(t('realEstate.countries.brazil.name'))} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
									<CardContent className="p-4 sm:p-5">
										<p className="text-sm sm:text-base font-semibold">{t('realEstate.countries.brazil.name')}</p>
										<p className="mt-1 text-xs sm:text-sm text-muted">{t('realEstate.countries.brazil.description')}</p>
									</CardContent>
								</Card>
							</div>
						</DialogContent>
					</Dialog>


					{/* 3) Rarity Agency third */}
					<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 hover:from-primary/15 hover:to-black/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
						<motion.div variants={itemVariants}>
							<a href="https://rarityagency.io" className="block px-4 py-5 sm:px-6 sm:py-6 md:py-7">
								<CardContent className="p-0">
									<h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-[-0.02em]">{t('cards.rarityAgency.title')}</h2>
									<p className="mt-2 text-sm text-muted leading-relaxed">{t('cards.rarityAgency.description')}</p>
									<span className="mt-3 sm:mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">{t('cards.rarityAgency.cta')}</span>
								</CardContent>
							</a>
						</motion.div>
					</Card>
				</motion.div>
			</section>

			{/* Value proposition section with reduced spacing */}
			<section className="mb-6 sm:mb-8 md:mb-10 rounded-xl border border-cardBorder bg-card p-4 sm:p-5 md:p-6 text-center">
				<h3 className="text-base sm:text-lg md:text-xl font-semibold">{t('valueProposition.title')}</h3>
				<p className="mx-auto mt-2 max-w-[500px] text-balance text-sm sm:text-base font-medium text-muted px-2 sm:px-4">
					{t('valueProposition.description')}
				</p>
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
