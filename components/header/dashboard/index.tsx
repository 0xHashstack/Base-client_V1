'use client';
import { Bell } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import SidebarToggleButton from '@/components/sidebar/components/sidebar-toggle-button';

function DashboardHeader() {
	return (
		<header className='h-[50px] w-full border-b border-header flex items-center justify-between px-3 sticky top-0 bg-background'>
			<div className='block lg:hidden'>
				<SidebarToggleButton />
			</div>

			<div className='ml-auto'>
				<Button
					variant='ghost'
					size='icon'
					className='w-8 h-8'>
					<Bell size={16} />
				</Button>
			</div>
		</header>
	);
}

export default DashboardHeader;
