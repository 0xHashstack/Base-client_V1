import { SIDEBAR_NAV_ITEMS } from '@/components/sidebar/constant';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function HeaderNav() {
	const pathName = usePathname();
	return (
		<div className='flex items-center gap-3'>
			{SIDEBAR_NAV_ITEMS.map((item, index) => {
				const isActive = pathName.includes(item.href);
				return (
					<Link
						href={item.href}
						className={cn(
							'text-[13px] text-primary-900 px-[20px] py-[10px] rounded-md hover:bg-background transition-colors',
							{
								'bg-background font-medium': isActive,
							}
						)}
						key={index}>
						{item.title}
					</Link>
				);
			})}
		</div>
	);
}

export default HeaderNav;
