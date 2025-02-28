import DashboardHeader from '@/components/header/dashboard';
import React from 'react';
import IsConnectedWrapper from '../wrapper/IsConnectedWrapper';
import Sidebar from '@/components/sidebar';

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex relative min-h-screen'>
			<IsConnectedWrapper>
				<Sidebar className='flex tablet:hidden' />
				<div className='flex-1 flex flex-col relative'>
					<DashboardHeader />
					<div
						className='flex-1 flex relative'
						id='drawer-root'>
						<div className='flex-1 mx-auto max-w-section w-full px-6 desktop:px-12 py-12 mt-header '>
							{children}
						</div>
					</div>
				</div>
			</IsConnectedWrapper>
		</div>
	);
}

export default DashboardLayout;
