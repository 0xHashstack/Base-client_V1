'use client';

import SidebarToggleButton from '@/components/sidebar/components/sidebar-toggle-button';
import HeaderNotification from './components/header-notification';
import Web3ConnectButton from '@/components/web3/button/connect-button';

function DashboardHeader() {
	return (
		<header className='h-[50px] w-full border-b border-header flex items-center justify-between px-3 sticky top-0 bg-background'>
			<div className='block lg:hidden'>
				<SidebarToggleButton />
			</div>

			<div className='ml-auto flex items-center gap-4'>
				<HeaderNotification />
				<Web3ConnectButton />
			</div>
		</header>
	);
}

export default DashboardHeader;
