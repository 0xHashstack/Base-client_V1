import React, { useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover/popover';
import { PopoverContentProps } from '@radix-ui/react-popover';

type HoverPopoverProps = Pick<PopoverContentProps, 'side' | 'sideOffset'> & {
	children: React.ReactNode;
	content: React.ReactNode;
	contentClassName?: string;
};

export function HoverPopover({
	children,
	content,
	contentClassName,
	...others
}: HoverPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setIsOpen(false);
		}, 100); // Small delay to prevent flickering
	};

	return (
		<Popover open={isOpen}>
			<PopoverTrigger
				asChild
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}>
				{children}
			</PopoverTrigger>
			<PopoverContent
				className={contentClassName}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...others}>
				{content}
			</PopoverContent>
		</Popover>
	);
}
