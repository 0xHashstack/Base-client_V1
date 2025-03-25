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
}

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	SliderProps
>(({ className, showTooltip = true, ...props }, ref) => {
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

	return (
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
				<TooltipProvider>
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
	);
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
