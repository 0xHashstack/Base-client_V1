'use client';

import { Button } from '@/components/ui/button';
import { useThemeAndLanguage } from '@/context/theme-language.context';
import { HstkTheme } from '@/types/ui/theme.types';
import { Moon, Sun } from '@phosphor-icons/react';
import React from 'react';

function ThemeToggleButton() {
	const { theme, updateTheme } = useThemeAndLanguage();

	const handleThemeToggle = () => {
		const newTheme =
			theme === HstkTheme.LIGHT ? HstkTheme.DARK : HstkTheme.LIGHT;
		updateTheme(newTheme);
	};

	return (
		<Button
			variant='ghost'
			size='icon'
			className='w-8 h-8'
			onClick={handleThemeToggle}>
			{theme === HstkTheme.LIGHT ?
				<Sun className='!size-6' />
			:	<Moon className='!size-6' />}
		</Button>
	);
}

export default ThemeToggleButton;
