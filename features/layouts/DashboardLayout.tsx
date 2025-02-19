import DashboardHeader from '@/components/header/dashboard';
import React from 'react';
import IsConnectedWrapper from '../wrapper/IsConnectedWrapper';
import Sidebar from '@/components/sidebar';

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex relative'>
			<IsConnectedWrapper>
				<Sidebar className='flex tablet:hidden' />
				<div className='flex-1 flex flex-col relative'>
					<DashboardHeader />
					<div className='flex-1 mx-auto max-w-section w-full px-6 py-12 mt-header'>
						{children}
					</div>
				</div>
			</IsConnectedWrapper>
		</div>
	);
}

export default DashboardLayout;
