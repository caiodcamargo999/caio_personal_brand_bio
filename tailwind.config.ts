import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", "system-ui", "sans-serif"],
				mono: ["var(--font-mono)", "ui-monospace", "monospace"],
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				muted: "var(--muted)",
				"muted-foreground": "var(--muted-foreground)",
				card: "var(--card)",
				cardBorder: "var(--card-border)",
				border: "var(--border)",
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
			},
			borderRadius: {
				lg: "12px",
				md: "8px",
				sm: "4px",
				none: "0px",
			},
			animation: {
				"marquee": "marquee var(--duration, 30s) linear infinite",
				"marquee-vertical": "marquee-vertical var(--duration, 30s) linear infinite",
				"vertical-slide": "verticalSlide 6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
			},
			keyframes: {
				marquee: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(calc(-100% - var(--gap)))" },
				},
				"marquee-vertical": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(calc(-100% - var(--gap)))" },
				},
				verticalSlide: {
					"0%, 25%": { transform: "translateY(0%)" },
					"33%, 58%": { transform: "translateY(-33.33%)" },
					"66%, 91%": { transform: "translateY(-66.66%)" },
					"100%": { transform: "translateY(-100%)" },
				},
			},
		},
	},
	plugins: [],
};

export default config;
