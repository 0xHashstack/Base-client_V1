'use client';

import HstkLogo from '@/components/logo/hstk-logo';
import HeaderNotification from './components/header-notification';
import Web3ConnectButton from '@/components/web3/button/connect-button';
import HeaderNav from './components/header-nav';
import SidebarToggleButton from '@/components/sidebar/components/sidebar-toggle-button';
import { List } from '@phosphor-icons/react';

function DashboardHeader() {
	return (
		<header className='bg-header h-header w-full border-b border-header flex items-center justify-between px-4 xl:px-12 sticky top-0 z-10'>
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
				<HeaderNotification />
				<Web3ConnectButton />
			</div>
		</header>
	);
}

export default DashboardHeader;
