import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarNavProps } from '../types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const SidebarNav = ({ items, isSidebarOpen }: SidebarNavProps) => {
	const pathName = usePathname();
	return (
		<div className='flex-1 overflow-y-auto'>
			<nav className='flex flex-col gap-1'>
				{items.map((item) => {
					const isActive = pathName.includes(item.href);
					return (
						<Tooltip
							key={item.href}
							delayDuration={0}>
							<TooltipTrigger asChild>
								<Link
									href={item.href}
									className={cn(
										'flex items-center h-9 px-3 gap-3 rounded-md hover:bg-accent text-primary-600 text-[13px]  font-normal whitespace-nowrap',
										{
											'bg-accent text-primary': isActive,
											'lg:px-2': !isSidebarOpen,
										}
									)}>
									{item.icon}
									<span
										className={cn('block', {
											'lg:hidden': !isSidebarOpen,
										})}>
										{item.title}
									</span>
								</Link>
							</TooltipTrigger>
							{!isSidebarOpen && (
								<TooltipContent
									side='right'
									className='hidden lg:block'>
									{item.title}
								</TooltipContent>
							)}
						</Tooltip>
					);
				})}
			</nav>
		</div>
	);
};
