import { customMerge } from '@/utils';
import { darkTheme, Theme } from '@rainbow-me/rainbowkit';

export const customRainbowKitTheme = customMerge<Theme>(darkTheme(), {
	colors: {
		modalBackground: 'hsl(var(--background))',
		modalText: 'hsl(var(--foreground))',
	},
} as Theme);
