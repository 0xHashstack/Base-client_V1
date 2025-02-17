import HstkIcon from '../../icons/HstkIcon';
import { SidebarHeaderProps } from '../types';
import { cn } from '@/lib/utils';

import SidebarToggleButton from './sidebar-toggle-button';

export const SidebarHeader = ({ isSidebarOpen }: SidebarHeaderProps) => {
	return (
		<>
			<div className={cn('h-12 items-center px-3 flex justify-between')}>
				<HstkIcon id='hstk-logo-sidebar' />
				<SidebarToggleButton
					className={cn('laptop:hidden', {
						'laptop:mx-auto': !isSidebarOpen,
					})}
				/>
			</div>
		</>
	);
};
