import { cn } from '@/lib/utils';
import { SidebarNavProps } from '../types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const SidebarNav = ({ items }: SidebarNavProps) => {
	const pathName = usePathname();
	return (
		<div className='flex-1 overflow-y-auto'>
			<nav className='flex flex-col gap-1'>
				{items.map((item) => {
					const isActive = pathName.includes(item.href);
					return (
						<Link
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
						</Link>
					);
				})}
			</nav>
		</div>
	);
};
