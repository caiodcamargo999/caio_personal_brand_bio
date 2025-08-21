import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)"],
				heading: ["var(--font-heading)"],
			},
			colors: {
				background: "#101010",
				foreground: "#ffffff",
				muted: "#A0A0A0",
				card: "#1C1C1C",
				cardBorder: "#2D2D2D",
				primary: {
					DEFAULT: "#8b5cf6",
					foreground: "#ffffff",
				},
			},
			borderRadius: {
				lg: "12px",
			},
		},
	},
	plugins: [],
};

export default config;


