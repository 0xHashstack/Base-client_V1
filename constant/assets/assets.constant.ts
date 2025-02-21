import { IMAGE_BASE_PATH } from '../config';

export const getImageUrl = (path: string) => IMAGE_BASE_PATH + path;

export const ICON_PATHS = {
	LOGO: '/icons/coins/logo.svg',
	DAI: '/icons/coins/DAI.svg',
	USDT: '/icons/coins/USDT.svg',
	USDC: '/icons/coins/USDC.svg',
	ETH: '/icons/coins/ETH.svg',
} as const;

export const ICON = Object.entries(ICON_PATHS).reduce(
	(acc, [key, path]) => ({
		...acc,
		[key]: getImageUrl(path),
	}),
	{} as Record<keyof typeof ICON_PATHS, string>
);
