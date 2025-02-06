import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { getCookie } from 'cookies-next/server';

import { cookies } from 'next/headers';
import { ThemeAndLanguageProvider } from '@/context/theme-language.context';
import { HstkTheme } from '@/types/ui/theme.types';
import { RootMetadata } from '@/constant/seo.constant';
import { HSTK_THEME_KEY } from '@/constant/config';
import { Web3Provider } from '@/context/web-3.context';

export const metadata: Metadata = RootMetadata;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userPrefTheme = await getCookie(HSTK_THEME_KEY, { cookies });
	return (
		<html lang='en'>
			<ThemeAndLanguageProvider
				defaultTheme={(userPrefTheme || HstkTheme.DARK) as HstkTheme}>
				<Web3Provider>{children}</Web3Provider>
			</ThemeAndLanguageProvider>
		</html>
	);
}
