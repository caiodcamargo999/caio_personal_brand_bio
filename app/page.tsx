"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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

export default function HomePage() {
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
		<main className="relative z-10 mx-auto max-w-[680px] w-full px-4 py-6 sm:py-8 md:py-12">
			<header className="mb-6 sm:mb-8 text-center">
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
						Caio de Camargo
					</h1>
					<p className="mx-auto max-w-[520px] text-balance text-base sm:text-lg font-normal leading-relaxed text-muted px-4">
						Helping you grow with AI, Strategy, Real Estate Investment Opportunities Worldwide & Business.
					</p>
				</motion.div>
			</header>

			{/* Buttons/cards section comes directly after header on mobile */}
			<section className="mb-10">
				<motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8 md:space-y-10">
				<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
					<motion.div variants={itemVariants}>
					<a href="https://rarityagency.io" target="_blank" rel="noopener noreferrer" className="block px-4 py-6 sm:px-6 sm:py-7">
						<CardContent className="p-0">
							<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">Rarity Agency</h2>
							<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">Marketing and AI agency to scale your brand and automate operations.</p>
							<span className="mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">Visit Agency →</span>
						</CardContent>
					</a>
					</motion.div>
				</Card>

				<Dialog>
					<DialogTrigger asChild>
						<Card className="group cursor-pointer overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/60">
							<motion.div className="px-4 py-6 sm:px-6 sm:py-7" variants={itemVariants}>
								<CardContent className="p-0">
									<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">Exclusive Real Estate Opportunities</h2>
									<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">Discover high-yield investment opportunities in emerging markets. Limited spots available for serious investors.</p>
									<span className="mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">Explore Investments →</span>
								</CardContent>
							</motion.div>
						</Card>
					</DialogTrigger>
					<DialogContent className="max-w-[520px] border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl">
						<DialogHeader>
							<DialogTitle className="bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">Real Estate Investment Opportunities</DialogTitle>
							<DialogDescription className="text-muted">Select your preferred investment destination to explore exclusive opportunities</DialogDescription>
						</DialogHeader>
						<div className="grid gap-3">
							<Card onClick={() => handleSelectCountry("Indonesia")} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
								<CardContent className="p-5">
									<p className="text-base font-semibold">Indonesia</p>
									<p className="mt-1 text-sm text-muted">Emerging market with high growth potential and attractive yields</p>
								</CardContent>
							</Card>
							<Card onClick={() => handleSelectCountry("Dubai")} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
								<CardContent className="p-5">
									<p className="text-base font-semibold">Dubai</p>
									<p className="mt-1 text-sm text-muted">Luxury real estate hub with tax advantages and world-class infrastructure</p>
								</CardContent>
							</Card>
							<Card onClick={() => handleSelectCountry("Brazil")} className="cursor-pointer border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-primary/0 transition-all hover:-translate-y-1 hover:border-primary/50">
								<CardContent className="p-5">
									<p className="text-base font-semibold">Brazil</p>
									<p className="mt-1 text-sm text-muted">Diverse market opportunities with strong fundamentals and growth prospects</p>
								</CardContent>
							</Card>
						</div>
					</DialogContent>
				</Dialog>

				<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
					<motion.div variants={itemVariants}>
					<a href="https://calendly.com/caiodcamargo/caiodecamargo_privatecall" target="_blank" rel="noopener noreferrer" className="block px-4 py-6 sm:px-6 sm:py-7">
						<CardContent className="p-0">
							<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">Strategy & Consulting</h2>
							<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">Personal and strategic consulting to unlock your business growth.</p>
							<span className="mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">Learn More →</span>
						</CardContent>
					</a>
					</motion.div>
				</Card>

				<Card className="group overflow-hidden border-cardBorder bg-gradient-to-tr from-card/95 to-black/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
					<motion.div variants={itemVariants}>
					<a href="https://www.linkedin.com/in/caiodecamargo/" target="_blank" rel="noopener noreferrer" className="block px-4 py-6 sm:px-6 sm:py-7">
						<CardContent className="p-0">
							<h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em]">Connect on LinkedIn</h2>
							<p className="mt-2 sm:mt-1.5 text-sm text-muted leading-relaxed">Let's connect and explore professional opportunities on LinkedIn.</p>
							<span className="mt-4 inline-block font-medium text-muted group-hover:text-white transition-colors">Connect Now →</span>
						</CardContent>
					</a>
					</motion.div>
				</Card>
				</motion.div>
			</section>

			<section className="mb-10 rounded-xl border border-cardBorder bg-card p-4 sm:p-6 text-center">
				<h3 className="text-lg sm:text-xl font-semibold">How I can help</h3>
				<p className="mx-auto mt-2 max-w-[500px] text-balance text-sm sm:text-base font-medium text-muted px-4">
					My mission is to provide the strategic leverage you need to achieve your goals.
				</p>
				<Button asChild className="mt-5 bg-primary text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:bg-violet-600">
					<a href="https://calendly.com/caiodcamargo/caiodecamargo_privatecall" target="_blank" rel="noopener noreferrer">Book a call</a>
				</Button>
			</section>

			<footer className="pb-5 text-center">
				<div className="mb-3 flex items-center justify-center gap-5 sm:gap-6 text-muted">
					<a href="https://www.linkedin.com/in/caiodecamargo/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-white transition-colors"><LinkedInLogo size={22} className="sm:w-6 sm:h-6" /></a>
					<a href="https://www.instagram.com/caiodcamargo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="hover:text-white transition-colors"><InstagramLogo size={22} className="sm:w-6 sm:h-6" /></a>
					<a href="https://x.com/caiodcamargo" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter Profile" className="hover:text-white transition-colors"><XLogo size={22} className="sm:w-6 sm:h-6" /></a>
				</div>
				<p className="text-xs sm:text-sm text-muted">© 2025 Caio de Camargo. All Rights Reserved.</p>
			</footer>
		</main>
	);
}
