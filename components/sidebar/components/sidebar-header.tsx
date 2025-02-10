import HstkIcon from '../../icons/HstkIcon';
import { SidebarHeaderProps } from '../types';
import { cn } from '@/lib/utils';

import SidebarToggleButton from './sidebar-toggle-button';

export const SidebarHeader = ({ isSidebarOpen }: SidebarHeaderProps) => {
	return (
		<>
			<div
				className={cn('h-12 items-center px-3 flex justify-between', {
					'lg:px-1.5': !isSidebarOpen,
				})}>
				<HstkIcon />
				<SidebarToggleButton
					className={cn('lg:hidden', {
						'lg:mx-auto': !isSidebarOpen,
					})}
				/>
			</div>
		</>
	);
};
