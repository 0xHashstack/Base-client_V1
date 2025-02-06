'use client';
import { useThemeAndLanguage } from '@/context/theme-language.context';
import { HstkTheme } from '@/types/ui/theme.types';
import React from 'react';

function Page() {
	const { updateTheme, theme } = useThemeAndLanguage();
	return (
		<div>
			<button
				onClick={() =>
					updateTheme(
						theme === HstkTheme.DARK ?
							HstkTheme.LIGHT
						:	HstkTheme.DARK
					)
				}>
				test
			</button>
		</div>
	);
}

export default Page;
