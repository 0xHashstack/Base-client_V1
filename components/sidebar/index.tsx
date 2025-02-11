'use client';
import { useLayoutStore } from '@/store/useLayout.store';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './components/sidebar-header';
import { SidebarNav } from './components/sidebar-nav';
import { SidebarThemeToggle } from './components/sidebar-theme-toggle';
import { SIDEBAR_NAV_ITEMS } from './constant';
import SidebarBottomUrls from './components/sidebar-bottom-urls';

function Sidebar({ className }: { className?: string }) {
	const { isSidebarOpen, toggleSidebar } = useLayoutStore();

	return (
		<aside
			className={cn(
				'z-30 h-screen bg-sidebar-bg transition-all duration-300 ease-in-out px-2.5 flex flex-col overflow-x-hidden w-[250px] text-primary-600',
				'lg:sticky lg:top-0',
				'fixed left-0 top-0',
				!isSidebarOpen ? '-translate-x-full' : 'lg:w-[250px]',
				className
			)}>
			<div className='flex flex-col flex-1 min-h-0'>
				<SidebarHeader isSidebarOpen={isSidebarOpen} />
				<SidebarNav items={SIDEBAR_NAV_ITEMS} />
			</div>
			<div className='flex flex-col gap-4'>
				<SidebarBottomUrls />

				<SidebarThemeToggle
					isSidebarOpen={isSidebarOpen}
					onToggle={toggleSidebar}
				/>
			</div>
		</aside>
	);
}

export default Sidebar;
