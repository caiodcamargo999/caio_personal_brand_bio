"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Globe } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
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

export default function HomePage() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const handleSelectCountry = (country: string) => {
		const message = `Hey Caio, I want to know about opportunities on Real Estate in ${country}`;
		const whatsappUrl = `https://wa.me/5551993288772?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	};

	const changeLanguage = (newLocale: string) => {
		// Remove the current locale from the pathname and add the new one
		const pathWithoutLocale = pathname.replace(`/${locale}`, '');
		router.push(`/${newLocale}${pathWithoutLocale}`);
	};

	const listVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.12 }
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 12 },
		show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
	};

	return (
		<main className="relative z-10 mx-auto max-w-[680px] w-full px-4 py-6 sm:py-10 md:py-16">
			{/* Language Switcher */}
			<div className="absolute top-4 right-4 sm:top-6 sm:right-6">
				<div className="relative group">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30"
					>
						<Globe size={20} />
					</Button>
					
					{/* Language Dropdown */}
					<div className="absolute right-0 top-full mt-2 w-32 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
						<div className="py-2">
							<button
								onClick={() => changeLanguage('en')}
								className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
									locale === 'en' ? 'text-primary' : 'text-white'
								}`}
							>
								🇺🇸 English
							</button>
							<button
								onClick={() => changeLanguage('pt')}
								className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
									locale === 'pt' ? 'text-primary' : 'text-white'
								}`}
							>
								🇧🇷 Português
							</button>
							<button
								onClick={() => changeLanguage('es')}
								className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
									locale === 'es' ? 'text-primary' : 'text-white'
								}`}
							>
								🇪🇸 Español
							</button>
						</div>
					</div>
				</div>
			</div>

			<header className="mb-8 sm:mb-10 text-center">
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<Image
						src="/caio-new-photo.jpg"
						alt="Caio de Camargo's Profile Photo"
						width={120}
						height={120}
						className="mx-auto mb-3 h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] rounded-full border-[3px] border-card bg-cardBorder object-cover object-[center_25%] shadow-[0_4px_15px_rgba(0,0,0,0.2),0_0_20px_rgba(139,92,246,0.1)]"
						priority
					/>
					<h1 className="bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-2xl font-bold tracking-[-0.03em] text-transparent sm:text-4xl md:text-[3.2rem] sm:leading-tight">
						{t('profile.name')}
					</h1>
					<p className="mx-auto max-w-[520px] text-balance text-base sm:text-lg font-normal leading-relaxed text-muted px-4">
						{t('profile.tagline')}
					</p>
				</motion.div>
			</header>

			<section className="mb-8 sm:mb-12 grid gap-4 sm:gap-6 md:gap-8">
				<motion.div variants={listVariants} initial="hidden" animate="show">
				<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
					<motion.div variants={itemVariants}>
					<a href="https://rarityagency.io" target="_blank" rel="noopener noreferrer" className="block px-4 py-5 sm:px-5 sm:py-6">
						<CardContent className="p-0">
							<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">{t('cards.rarityAgency.title')}</h2>
							<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">{t('cards.rarityAgency.description')}</p>
							<span className="mt-4 sm:mt-3 inline-block font-medium text-muted group-hover:text-white transition-colors">{t('cards.rarityAgency.cta')}</span>
						</CardContent>
					</a>
					</motion.div>
				</Card>

				<Dialog>
					<DialogTrigger asChild>
						<Card className="group cursor-pointer overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/60">
							<motion.div className="px-4 py-5 sm:px-5 sm:py-6" variants={itemVariants}>
								<CardContent className="p-0">
									<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">{t('cards.realEstate.title')}</h2>
									<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">{t('cards.realEstate.description')}</p>
									<span className="mt-4 sm:mt-3 inline-block font-medium text-muted group-hover:text-white transition-colors">{t('cards.realEstate.cta')}</span>
								</CardContent>
							</motion.div>
						</Card>
					</DialogTrigger>
					<DialogContent className="max-w-[520px] border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl">
						<DialogHeader>
							<DialogTitle className="bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">{t('realEstateModal.title')}</DialogTitle>
							<DialogDescription className="text-muted">{t('realEstateModal.subtitle')}</DialogDescription>
						</DialogHeader>
						<div className="grid gap-3">
							<Card onClick={() => handleSelectCountry("Indonesia")} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
								<CardContent className="p-5">
									<p className="text-base font-semibold">{t('realEstateModal.countries.indonesia.name')}</p>
									<p className="mt-1 text-sm text-muted">{t('realEstateModal.countries.indonesia.description')}</p>
								</CardContent>
							</Card>
							<Card onClick={() => handleSelectCountry("Dubai")} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
								<CardContent className="p-5">
									<p className="text-base font-semibold">{t('realEstateModal.countries.dubai.name')}</p>
									<p className="mt-1 text-sm text-muted">{t('realEstateModal.countries.dubai.description')}</p>
								</CardContent>
							</Card>
							<Card onClick={() => handleSelectCountry("Brazil")} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
								<CardContent className="p-5">
									<p className="text-base font-semibold">{t('realEstateModal.countries.brazil.name')}</p>
									<p className="mt-1 text-sm text-muted">{t('realEstateModal.countries.brazil.description')}</p>
								</CardContent>
							</Card>
						</div>
					</DialogContent>
				</Dialog>

				<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
					<motion.div variants={itemVariants}>
					<a href="https://calendly.com/caiodcamargo/caiodecamargo_privatecall" target="_blank" rel="noopener noreferrer" className="block px-4 py-5 sm:px-5 sm:py-6">
						<CardContent className="p-0">
							<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">{t('cards.consulting.title')}</h2>
							<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">{t('cards.consulting.description')}</p>
							<span className="mt-4 sm:mt-3 inline-block font-medium text-muted group-hover:text-white transition-colors">{t('cards.consulting.cta')}</span>
						</CardContent>
					</a>
					</motion.div>
				</Card>

				<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
					<motion.div variants={itemVariants}>
					<a href="https://www.linkedin.com/in/caiodecamargo/" target="_blank" rel="noopener noreferrer" className="block px-4 py-5 sm:px-5 sm:py-6">
						<CardContent className="p-0">
							<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">{t('cards.linkedin.title')}</h2>
							<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">{t('cards.linkedin.description')}</p>
							<span className="mt-4 sm:mt-3 inline-block font-medium text-muted group-hover:text-white transition-colors">{t('cards.linkedin.cta')}</span>
						</CardContent>
					</a>
					</motion.div>
				</Card>
				</motion.div>
			</section>

			<section className="mb-8 sm:mb-10 rounded-xl border border-cardBorder bg-card p-4 sm:p-6 text-center">
				<h3 className="text-lg sm:text-xl font-semibold">{t('valueProp.title')}</h3>
				<p className="mx-auto mt-2 max-w-[500px] text-balance text-sm sm:text-base font-medium text-muted px-4">
					{t('valueProp.description')}
				</p>
				<Button asChild className="mt-4 bg-primary text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:bg-violet-600">
					<a href="https://calendly.com/caiodcamargo/caiodecamargo_privatecall" target="_blank" rel="noopener noreferrer">{t('valueProp.cta')}</a>
				</Button>
			</section>

			<footer className="pb-4 sm:pb-5 text-center">
				<div className="mb-2 flex items-center justify-center gap-4 sm:gap-6 text-muted">
					<a href="https://www.linkedin.com/in/caiodecamargo/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-white transition-colors"><Linkedin size={20} className="sm:w-6 sm:h-6" /></a>
					<a href="https://www.instagram.com/caiodcamargo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="hover:text-white transition-colors"><Instagram size={20} className="sm:w-6 sm:h-6" /></a>
					<a href="https://x.com/caiodcamargo" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter Profile" className="hover:text-white transition-colors"><Twitter size={20} className="sm:w-6 sm:h-6" /></a>
				</div>
				<p className="text-xs sm:text-sm text-muted">{t('footer.copyright')}</p>
			</footer>
		</main>
	);
}
