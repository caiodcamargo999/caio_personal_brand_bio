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
					50: "#f5f3ff",
					100: "#ede9fe",
					200: "#ddd6fe",
					300: "#c4b5fd",
					400: "#a78bfa",
					500: "#8b5cf6",
					600: "#7c3aed",
					700: "#6d28d9",
					800: "#5b21b6",
					900: "#4c1d95",
				},
				accent: {
					DEFAULT: "#8b5cf6",
					foreground: "#ffffff",
				},
				secondary: {
					DEFAULT: "#1C1C1C",
					foreground: "#A0A0A0",
				},
			},
			borderRadius: {
				lg: "12px",
			},
			boxShadow: {
				'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
				'glow-lg': '0 0 30px rgba(139, 92, 246, 0.4)',
				'inner-glow': 'inset 0 2px 4px rgba(139, 92, 246, 0.1)',
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'glow-pulse': 'glowPulse 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'scan': 'scan 2s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				glowPulse: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
					'50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				scan: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
			},
		},
	},
	plugins: [],
};

export default config;


