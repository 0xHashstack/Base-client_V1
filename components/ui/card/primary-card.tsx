import { cn } from '@/lib/utils';
import React from 'react';

interface PrimaryCardComponent
	extends React.ForwardRefExoticComponent<
		React.HTMLAttributes<HTMLDivElement> &
			React.RefAttributes<HTMLDivElement>
	> {
	Header: typeof Header;
	Body: typeof Body;
	Footer: typeof Footer;
}

const PrimaryCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'rounded-xl bg-card text-card-foreground flex flex-col',
			className
		)}
		{...props}
	/>
)) as PrimaryCardComponent;

const Header = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'flex items-center justify-between p-4 border-b',
			className
		)}
		{...props}
	/>
));

const Body = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex flex-col gap-4 px-4 py-6', className)}
		{...props}
	/>
));

const Footer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'flex items-center justify-between mt-auto px-4 border-t',
			className
		)}
		{...props}
	/>
));

PrimaryCard.displayName = 'PrimaryCard';
Header.displayName = 'PrimaryCard.Header';
Body.displayName = 'PrimaryCard.Body';
Footer.displayName = 'PrimaryCard.Footer';

PrimaryCard.Header = Header;
PrimaryCard.Body = Body;
PrimaryCard.Footer = Footer;

export default PrimaryCard;
