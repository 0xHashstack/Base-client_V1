'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface SliderProps
	extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
	showTooltip?: boolean;
	fixedStepsPercentage?: number[];
	onStepClick?: (value: number) => void;
}

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	SliderProps
>(
	(
		{
			className,
			showTooltip = true,
			fixedStepsPercentage,
			onStepClick,
			...props
		},
		ref
	) => {
		const percentage =
			props.value !== undefined ?
				props.value.length > 0 ?
					Math.round(
						((props.value[0] - (props.min || 0)) /
							((props.max || 100) - (props.min || 0))) *
							100
					)
				:	0
			:	0;

		const handleStepClick = (value: number) => {
			if (onStepClick) {
				onStepClick(value);
			}
		};

		return (
			<div className='flex flex-col w-full gap-1'>
				<SliderPrimitive.Root
					ref={ref}
					className={cn(
						'relative flex w-full touch-none select-none items-center',
						className
					)}
					{...props}>
					<SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-background'>
						<SliderPrimitive.Range className='absolute h-full bg-slider-bg data-[disabled]:bg-slider-bg/70' />
					</SliderPrimitive.Track>
					{showTooltip ?
						<TooltipProvider delayDuration={300}>
							<Tooltip>
								<TooltipTrigger asChild>
									<SliderPrimitive.Thumb className='block h-4 w-4 rounded-full border-4 border-slider-thumb bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:border-slider-thumb/70' />
								</TooltipTrigger>
								<TooltipContent side='bottom'>
									{percentage}%
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					:	<SliderPrimitive.Thumb className='block h-4 w-4 rounded-full border-[6px] border-slider-thumb bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:border-slider-thumb/70' />
					}
				</SliderPrimitive.Root>

				{fixedStepsPercentage && fixedStepsPercentage.length > 0 && (
					<div className='relative w-full mt-2 flex justify-between items-center '>
						{fixedStepsPercentage.map((step, index) => (
							<button
								key={index}
								type='button'
								data-step={step}
								className={cn(
									'text-xs text-muted-foreground hover:text-primary transition-colors transform',
									percentage === step &&
										'text-primary font-medium',
									step === 0 ? 'relative' : (
										'absolute -translate-x-1/2'
									),
									step === 100 ? '-translate-x-full' : ''
								)}
								style={{
									left: `${step}%`,
								}}
								onClick={() => handleStepClick(step)}>
								{step}%
							</button>
						))}
					</div>
				)}
			</div>
		);
	}
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
