import BorrowAprCard, {
	BorrowAprCardProps,
} from '@/components/logic/card/borrow/borrow-apr-card';
import BorrowHealthCard, {
	BorrowHealthCardProps,
} from '@/components/logic/card/borrow/borrow-health-card';
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

export function HoverBorrowAprCard({
	children,
	...props
}: HoverBorrowCardProps<BorrowAprCardProps>) {
	return (
		<HoverPopover
			side='right'
			content={<BorrowAprCard {...props} />}
			contentClassName='w-[202px]'>
			{children}
		</HoverPopover>
	);
}

export function HoverBorrowHealthCard({
	children,
	...props
}: HoverBorrowCardProps<BorrowHealthCardProps>) {
	return (
		<HoverPopover
			side='right'
			content={<BorrowHealthCard {...props} />}
			removePadding
			contentClassName='w-[217px]'>
			{children}
		</HoverPopover>
	);
}
