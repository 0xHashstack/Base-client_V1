import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarThemeToggleProps } from '../types';
import {
	CaretDoubleLeft,
	CaretDoubleRight,
	Moon,
	Sun,
} from '@phosphor-icons/react';
import { useThemeAndLanguage } from '@/context/theme-language.context';
import { HstkTheme } from '@/types/ui';

export const SidebarThemeToggle = ({
	isSidebarOpen,
	onToggle,
}: SidebarThemeToggleProps) => {
	const { theme, updateTheme } = useThemeAndLanguage();

	const handleThemeToggle = (payload?: HstkTheme) => {
		const newTheme =
			payload ??
			(theme === HstkTheme.LIGHT ? HstkTheme.DARK : HstkTheme.LIGHT);
		updateTheme(newTheme);
	};

	return (
		<div className='flex flex-col gap-1.5 pb-4'>
			<Tabs
				className={cn('w-full block', {
					'lg:hidden': !isSidebarOpen,
				})}
				defaultValue={theme}
				onValueChange={(value) =>
					handleThemeToggle(value as HstkTheme)
				}>
				<TabsList className='w-full grid grid-cols-2'>
					<TabsTrigger
						value={HstkTheme.DARK}
						className='flex items-center gap-2 h-full shadow-none'>
						<Moon size={16} />
					</TabsTrigger>
					<TabsTrigger
						value={HstkTheme.LIGHT}
						className='flex items-center gap-2 h-full shadow-none'>
						<Sun size={16} />
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div
				className={cn('hidden mx-auto', {
					'lg:block': !isSidebarOpen,
				})}>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='w-6 h-6 mx-auto'
							onClick={() => handleThemeToggle()}>
							{true ?
								<Moon size={16} />
							:	<Sun size={16} />}
						</Button>
					</TooltipTrigger>
					<TooltipContent side='right'>
						{true ? 'Dark Mode' : 'Light Mode'}
					</TooltipContent>
				</Tooltip>
			</div>

			<Button
				variant='ghost'
				size='icon'
				className={cn('w-6 h-6', {
					'lg:mx-auto': !isSidebarOpen,
				})}
				onClick={() => onToggle(!isSidebarOpen)}>
				{isSidebarOpen ?
					<CaretDoubleLeft size={16} />
				:	<CaretDoubleRight size={16} />}
			</Button>
		</div>
	);
};
