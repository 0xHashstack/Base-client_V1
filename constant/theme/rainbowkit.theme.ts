import { customMerge } from '@/utils';
import { darkTheme, Theme } from '@rainbow-me/rainbowkit';

export const customRainbowKitTheme = customMerge<Theme>(darkTheme(), {
	fonts: {
		body: 'var(--font-inter)',
	},
	colors: {
		modalBackground: 'hsl(var(--rk-background))',
		modalText: 'hsl(var(--rk-foreground))',
		modalTextSecondary: 'hsl(var(--rk-foreground))',
		connectButtonBackground: 'hsl(var(--rk-background))',
		connectButtonInnerBackground: 'hsl(var(--background))',
		connectButtonText: 'hsl(var(--rk-foreground))',
		profileAction: 'hsl(var(--background))',
		generalBorder: 'hsl(var(--border-header))',
	},
} as Theme);
