'use client';

import NotFoundBase from '@/components/404/not-found.component';
import DashboardLayout from '@/features/layouts/DashboardLayout';

export default function NotFound() {
	return (
		<DashboardLayout>
			<NotFoundBase />
		</DashboardLayout>
	);
}
