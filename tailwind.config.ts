import type { Config } from 'tailwindcss';

export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./features/**/*.{js,ts,jsx,tsx,mdx}',
	],

	theme: {
		extend: {
			maxWidth: {
				section: 'var(--max-section-width)',
			},
			width: {
				section: 'var(--max-section-width)',
			},
			textColor: {
				primary: {
					DEFAULT: 'hsl(var(--text-primary-900))',
					900: 'hsl(var(--text-primary-900))',
					600: 'hsl(var(--text-primary-600))',
					500: 'hsl(var(--text-primary-500))',
				},
			},
			borderColor: {
				header: 'hsl(var(--border-header))',
				table: 'hsl(var(--border-table))',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				header: {
					DEFAULT: 'hsl(var(--primary-header))',
				},
				button: {
					primary: {
						DEFAULT: 'hsl(var(--primary-button))',
						text: 'hsl(var(--primary-button-text))',
					},
					secondary: {
						DEFAULT: 'hsl(var(--secondary-button))',
						text: 'hsl(var(--secondary-button-text))',
					},
					outline: {
						border: 'hsl(var(--outline-button-border))',
						text: 'hsl(var(--outline-button-text))',
					},
					wallet: {
						DEFAULT: 'hsl(var(--wallet-connect-button))',
						text: 'hsl(var(--wallet-connect-button-text))',
					},
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				sidebar: {
					bg: 'hsl(var(--sidebar-bg))',
				},
				tab: {
					DEFAULT: 'hsl(var(--tab-bg))',
					active: 'hsl(var(--active-tab-bg))',
				},
				table: {
					DEFAULT: 'hsl(var(--table-bg))',
					hover: 'hsl(var(--table-hover))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			screens: {
				mobile: '320px', // Small mobile devices
				tablet: '640px', // Tablets and larger phones
				laptop: '1024px', // Laptops and small desktops
				desktop: '1280px', // Standard desktop monitors
				wide: '1536px', // Wide/large desktop screens
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
} satisfies Config;
