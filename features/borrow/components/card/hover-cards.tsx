import BorrowValueCard, {
	BorrowValueCardProps,
} from '@/components/logic/card/borrow/borrow-value-card';
import { HoverPopover } from '@/components/ui/popover/hover-popover';
import React from 'react';

type HoverBorrowCardProps<T> = T & { children: React.ReactNode };

export function HoverBorrowValueCard({
	children,
	...props
}: HoverBorrowCardProps<BorrowValueCardProps>) {
	return (
		<HoverPopover
			side='right'
			content={<BorrowValueCard {...props} />}
			contentClassName='w-[202px]'>
			{children}
		</HoverPopover>
	);
}
