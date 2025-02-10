import DashboardLayout from '@/features/layouts/DashboardLayout';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
	return <DashboardLayout>{children}</DashboardLayout>;
}

export default layout;
