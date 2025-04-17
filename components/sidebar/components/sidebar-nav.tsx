import { cn } from '@/lib/utils';
import { SidebarNavProps } from '../types';
import { usePathname } from 'next/navigation';
import DashboardLink from '@/components/common/DashboardLink';
import { useLayoutStore } from '@/store/useLayout.store';

export const SidebarNav = ({ items }: SidebarNavProps) => {
	const pathName = usePathname();
	const { toggleSidebar } = useLayoutStore();
	return (
		<div className='flex-1 overflow-y-auto'>
			<nav className='flex flex-col gap-1'>
				{items.map((item) => {
					const isActive = pathName.includes(item.href);
					return (
						<DashboardLink
							onClick={() => toggleSidebar(false)}
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center h-9 px-3 gap-3 rounded-md hover:bg-accent text-primary-600 text-[13px]  font-normal whitespace-nowrap',
								{
									'bg-accent text-primary': isActive,
								}
							)}>
							{item.icon}
							<span className='block'>{item.title}</span>
						</DashboardLink>
					);
				})}
			</nav>
		</div>
	);
};
