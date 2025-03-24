'use client';

import { HSTK_THEME_KEY } from '@/constant/config';
import { HstkTheme } from '@/types/ui/theme.types';
import { useSetCookie } from 'cookies-next/client';
import { createContext, useContext, useState } from 'react';
import { Toaster } from 'sonner';

interface ThemeAndLanguageContext {
	theme: HstkTheme;
	updateTheme: (theme: HstkTheme) => void;
}

const ThemeAndLanguageContext = createContext<ThemeAndLanguageContext | null>(
	null
);

export const useThemeAndLanguage = () => {
	const context = useContext(ThemeAndLanguageContext);
	if (!context) {
		throw new Error(
			'useThemeAndLanguage must be used within a ThemeAndLanguageProvider'
		);
	}
	return context;
};

export const ThemeAndLanguageProvider = ({
	children,
	defaultTheme = HstkTheme.LIGHT,
}: {
	children: React.ReactNode;
	defaultTheme: HstkTheme;
}) => {
	const setCookie = useSetCookie();
	const [theme, setTheme] = useState<HstkTheme>(defaultTheme);

	const updateTheme = (newTheme: HstkTheme) => {
		setTheme(newTheme);
		setCookie(HSTK_THEME_KEY, newTheme);
	};

	return (
		<ThemeAndLanguageContext.Provider value={{ theme, updateTheme }}>
			<body
				data-theme-id={theme}
				className={`hstk-theme antialiased`}>
				{children}
				<Toaster
					theme={theme}
					closeButton
					duration={4000}
					position='top-right'
				/>
			</body>
		</ThemeAndLanguageContext.Provider>
	);
};
