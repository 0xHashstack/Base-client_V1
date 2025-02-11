import DashboardHeader from '@/components/header/dashboard';
import Sidebar from '@/components/sidebar';
import React from 'react';
import IsConnectedWrapper from '../wrapper/IsConnectedWrapper';

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex relative'>
			<IsConnectedWrapper>
				<Sidebar />
				<div className='flex-1 flex flex-col relative'>
					<DashboardHeader />
					<div className='flex-1'>{children}</div>
				</div>
			</IsConnectedWrapper>
		</div>
	);
}

export default DashboardLayout;
