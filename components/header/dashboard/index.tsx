'use client';

import HstkLogo from '@/components/logo/hstk-logo';
import ThemeToggleButton from './components/theme-toggle-button';
import Web3ConnectButton from '@/components/web3/button/connect-button';
import HeaderNav from './components/header-nav';
import SidebarToggleButton from '@/components/sidebar/components/sidebar-toggle-button';
import { List } from '@phosphor-icons/react';

function DashboardHeader() {
	return (
		<header className='bg-header h-header w-full border-b border-header flex items-center justify-between px-4 desktop:px-12 fixed top-0 z-10'>
			<div className='flex items-center gap-4 laptop:gap-12 '>
				<div className='hidden tablet:block'>
					<HstkLogo hideTitleOnMobile />
				</div>
				<div className='hidden tablet:block'>
					<HeaderNav />
				</div>
				<div className='block tablet:hidden'>
					<SidebarToggleButton icon={<List className='!size-6' />} />
				</div>
			</div>
			<div className='flex items-center gap-4'>
				<ThemeToggleButton />
				<Web3ConnectButton />
			</div>
		</header>
	);
}

export default DashboardHeader;
