'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TimePeriod = '1D' | '1W' | '1M' | 'All';

interface TimePeriodSelectorProps {
	selectedPeriod: TimePeriod;
	onChange: (period: TimePeriod) => void;
	className?: string;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
	selectedPeriod,
	onChange,
	className = '',
}) => {
	const periods = useMemo<TimePeriod[]>(() => ['1D', '1W', '1M', 'All'], []);
	const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
	const [indicatorStyle, setIndicatorStyle] = useState({
		left: 0,
		width: 0,
	});

	// Update indicator position when the selected period changes
	useEffect(() => {
		const activeIndex = periods.findIndex(
			(period) => period === selectedPeriod
		);
		if (activeIndex !== -1 && buttonsRef.current[activeIndex]) {
			const activeButton = buttonsRef.current[activeIndex];
			if (activeButton) {
				setIndicatorStyle({
					left: activeButton.offsetLeft + 4,
					width: activeButton.offsetWidth,
				});
			}
		}
	}, [selectedPeriod, periods]);

	// Update indicator position on window resize
	useEffect(() => {
		const handleResize = () => {
			const activeIndex = periods.findIndex(
				(period) => period === selectedPeriod
			);
			if (activeIndex !== -1 && buttonsRef.current[activeIndex]) {
				const activeButton = buttonsRef.current[activeIndex];
				if (activeButton) {
					setIndicatorStyle({
						left: activeButton.offsetLeft + 4,
						width: activeButton.offsetWidth,
					});
				}
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [selectedPeriod, periods]);

	return (
		<div
			className={cn(
				'relative flex rounded-lg bg-tab p-1 z-[1]',
				className
			)}>
			{/* Sliding indicator */}
			<motion.div
				className='absolute top-1 bottom-1 rounded-md z-0 bg-tab-active'
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
			/>

			{/* Buttons */}
			<div className='relative flex z-10 w-full'>
				{periods.map((period, index) => (
					<button
						key={period}
						ref={(el) => {
							buttonsRef.current[index] = el;
						}}
						className='relative flex-1 px-3 py-1 text-xs font-medium z-10 transition-colors duration-200 rounded-md'
						onClick={() => onChange(period)}>
						{period}
					</button>
				))}
			</div>
		</div>
	);
};

export default TimePeriodSelector;
