import DashboardLink from '@/components/common/DashboardLink';
import { SIDEBAR_NAV_ITEMS } from '@/components/sidebar/constant';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function HeaderNav() {
	const pathName = usePathname();
	const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const [indicatorStyle, setIndicatorStyle] = useState({
		left: 0,
		width: 0,
		opacity: 0,
	});

	// Update indicator position when the active nav item changes
	useEffect(() => {
		const activeIndex = SIDEBAR_NAV_ITEMS.findIndex((item) =>
			pathName.includes(item.href)
		);

		if (activeIndex !== -1 && navRefs.current[activeIndex]) {
			const activeElement = navRefs.current[activeIndex];
			if (activeElement) {
				setIndicatorStyle({
					left: activeElement.offsetLeft,
					width: activeElement.offsetWidth,
					opacity: 1,
				});
			}
		} else {
			setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
		}
	}, [pathName]);

	// Update indicator position on window resize
	useEffect(() => {
		const handleResize = () => {
			const activeIndex = SIDEBAR_NAV_ITEMS.findIndex((item) =>
				pathName.includes(item.href)
			);

			if (activeIndex !== -1 && navRefs.current[activeIndex]) {
				const activeElement = navRefs.current[activeIndex];
				if (activeElement) {
					setIndicatorStyle({
						left: activeElement.offsetLeft,
						width: activeElement.offsetWidth,
						opacity: 1,
					});
				}
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [pathName]);

	return (
		<div className='relative flex items-center gap-3'>
			{/* Sliding indicator */}
			<motion.div
				className='absolute top-0 bottom-0 rounded-md bg-header-active z-0'
				initial={false}
				animate={{
					left: indicatorStyle.left,
					width: indicatorStyle.width,
					opacity: indicatorStyle.opacity,
				}}
				transition={{
					type: 'spring',
					stiffness: 300,
					damping: 30,
				}}
			/>

			{SIDEBAR_NAV_ITEMS.map((item, index) => {
				const isActive = pathName.includes(item.href);
				return (
					<DashboardLink
						ref={(el) => {
							navRefs.current[index] = el;
						}}
						href={item.href}
						className={cn(
							'relative text-[13px] text-primary-900 px-[20px] py-[10px] rounded-md hover:bg-header-active transition-colors z-10',
							{
								'font-medium': isActive,
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
