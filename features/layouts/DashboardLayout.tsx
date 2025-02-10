import DashboardHeader from '@/components/header/dashboard';
import Sidebar from '@/components/sidebar';
import React from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex relative'>
			<Sidebar />
			<div className='flex-1 flex flex-col relative'>
				<DashboardHeader />
				<div className='flex-1'>{children}</div>
			</div>
		</div>
	);
}

export default DashboardLayout;
