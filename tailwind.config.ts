import type { Config } from 'tailwindcss';

export default {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./features/**/*.{js,ts,jsx,tsx,mdx}',
	],

	theme: {
		extend: {
			spacing: {
				header: 'var(--header-height)',
			},
			maxWidth: {
				section: 'var(--max-section-width)',
			},
			width: {
				section: 'var(--max-section-width)',
			},
			textColor: {
				primary: {
					'500': 'hsl(var(--text-primary-500))',
					'600': 'hsl(var(--text-primary-600))',
					'900': 'hsl(var(--text-primary-900))',
					DEFAULT: 'hsl(var(--text-primary-900))',
				},
				link: {
					DEFAULT: 'hsl(var(--link))',
				},

				badge: {
					success: 'hsl(var(--badge-success-text))',
					secondary: 'hsl(var(--badge-secondary-text))',
				},
				placeholder: {
					DEFAULT: 'hsl(var(--placeholder))',
				},
			},
			borderColor: {
				header: 'hsl(var(--border-header))',
				table: 'hsl(var(--border-table))',
				tab: 'hsl(var(--border-tab))',
				popup: 'hsl(var(--border-popup))',
				form: 'hsl(var(--border-form))',
				card: 'hsl(var(--border-card))',
				'quick-stat': 'hsl(var(--border-quick-stat))',
			},
			height: {
				header: 'var(--header-height)',
			},
			inset: {
				header: 'var(--header-height)',
			},
			colors: {
				badge: {
					success: 'hsl(var(--badge-success))',
					secondary: 'hsl(var(--badge-secondary))',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				header: {
					DEFAULT: 'hsl(var(--primary-header))',
					active: 'hsl(var(--primary-header-active))',
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
					secondary: 'hsl(var(--card-secondary))',
					bold: 'hsl(var(--card-bold))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
					hover: 'hsl(var(--hover-popover))',
				},
				primary: {
					'1': 'hsl(var(--primary-1))',
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
				border: {
					DEFAULT: 'hsl(var(--border))',
					card: 'hsl(var(--border-card))',
				},
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
				slider: {
					bg: 'hsl(var(--slider-bg))',
					thumb: 'hsl(var(--slider-thumb))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			screens: {
				mobile: '320px',
				tablet: '640px',
				laptop: '1024px',
				desktop: '1280px',
				wide: '1536px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
} satisfies Config;
