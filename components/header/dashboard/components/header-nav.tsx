import DashboardLink from '@/components/common/DashboardLink';
import { SIDEBAR_NAV_ITEMS } from '@/components/sidebar/constant';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

function HeaderNav() {
	const pathName = usePathname();
	return (
		<div className='flex items-center gap-3'>
			{SIDEBAR_NAV_ITEMS.map((item, index) => {
				const isActive = pathName.includes(item.href);
				return (
					<DashboardLink
						href={item.href}
						className={cn(
							'text-[13px] text-primary-900 px-[20px] py-[10px] rounded-md hover:bg-background transition-colors',
							{
								'bg-background font-medium': isActive,
							}
						)}
						key={index}>
						{item.title}
					</DashboardLink>
				);
			})}
		</div>
	);
}

export default HeaderNav;
