'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TabItem<T> = {
	id: T;
	label: string;
};

type SlidingTabProps<T> = {
	tabs: TabItem<T>[];
	activeTab: T;
	onChange: (tabId: T) => void;
	className?: string;
	tabClassName?: string;
	activeTabClassName?: string;
};

/**
 * SlidingTab component with animated background transition
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'tab1', label: 'Tab 1' },
 *   { id: 'tab2', label: 'Tab 2' },
 * ];
 *
 * const [activeTab, setActiveTab] = useState('tab1');
 *
 * return (
 *   <SlidingTab
 *     tabs={tabs}
 *     activeTab={activeTab}
 *     onChange={setActiveTab}
 *   />
 * );
 * ```
 */
export default function SlidingTab<T>({
	tabs,
	activeTab,
	onChange,
	className,
	tabClassName,
	activeTabClassName,
}: SlidingTabProps<T>) {
	const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
	const [indicatorStyle, setIndicatorStyle] = useState({
		left: 0,
		width: 0,
	});

	// Update indicator position when the active tab changes
	useEffect(() => {
		const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
		if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
			const activeTabElement = tabsRef.current[activeIndex];
			if (activeTabElement) {
				setIndicatorStyle({
					left: activeTabElement.offsetLeft,
					width: activeTabElement.offsetWidth,
				});
			}
		}
	}, [activeTab, tabs]);

	// Update indicator position on window resize
	useEffect(() => {
		const handleResize = () => {
			const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
			if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
				const activeTabElement = tabsRef.current[activeIndex];
				if (activeTabElement) {
					setIndicatorStyle({
						left: activeTabElement.offsetLeft,
						width: activeTabElement.offsetWidth,
					});
				}
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [activeTab, tabs]);

	return (
		<div className={cn('relative flex rounded-lg p-1 bg-tab', className)}>
			{/* Sliding indicator */}
			<motion.div
				className='absolute top-1 bottom-1 rounded-md z-0'
				initial={false}
				animate={{
					left: indicatorStyle.left,
					width: indicatorStyle.width,
				}}
				transition={{
					type: 'spring',
					stiffness: 300,
					damping: 30,
				}}
				style={{
					backgroundColor: 'hsl(var(--active-tab-bg))',
				}}
			/>

			{/* Tabs */}
			<div className='relative flex z-10 w-full'>
				{tabs.map((tab, index) => (
					<button
						key={tab.id as string}
						ref={(el) => {
							tabsRef.current[index] = el;
						}}
						className={cn(
							'relative flex-1 px-4 py-2 text-sm font-medium z-10 transition-colors duration-200 rounded-md',
							activeTab === tab.id ?
								'text-gray-800 ' + (activeTabClassName || '')
							:	'text-gray-600 hover:text-gray-800',
							tabClassName
						)}
						onClick={() => onChange(tab.id)}>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
}
