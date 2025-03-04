import React, { useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { Text } from '../ui/typography/Text';
import { Btn } from '../ui/button';

interface SideDrawerProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	width?: number;
	children: React.ReactNode;
	title?: string;
	className?: string;
	hideHeader?: boolean;
}

interface HeaderProps {
	title?: string;
	onClose?: () => void;
	children?: React.ReactNode;
	className?: string;
}

// Header component for the SideDrawer
function Header({ title, onClose, children, className }: HeaderProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-between p-6 border-b',
				className
			)}>
			{children ?
				children
			:	<>
					<Text.Semibold16>{title}</Text.Semibold16>
					{onClose && (
						<Btn.Ghost onClick={onClose}>
							<X className='h-5 w-5' />
						</Btn.Ghost>
					)}
				</>
			}
		</div>
	);
}

// Body component for the SideDrawer
function Body({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'flex-1 overflow-y-auto w-screen tablet:w-[min(80vw,var(--drawer-width))] p-6',
				className
			)}>
			{children}
		</div>
	);
}

// Footer component for the SideDrawer
function Footer({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('flex-shrink-0 p-6 border-t', className)}>
			{children}
		</div>
	);
}

function SideDrawer({
	open,
	setOpen,
	width = 424,
	children,
	className,
}: SideDrawerProps) {
	const [mounted, setMounted] = useState(false);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	// Use the escape key hook
	useEscapeKey(handleClose, open);

	// Handle portal mounting
	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted) return null;

	const drawerContent = (
		<div
			className={cn(
				'fixed laptop:sticky h-[90vh] tablet:h-screen  tablet:pt-header bg-popover shadow-xl transition-all duration-300 ease-in-out overflow-hidden  flex-shrink-0 flex flex-col z-20 tablet:z-0',
				' tablet:top-0 right-0 bottom-0 ',
				'rounded-t-xl tablet:rounded-t-none',
				'shadow-2xl tablet:shadow-none',
				!open ? 'w-0' : (
					'w-screen tablet:w-[min(80vw,var(--drawer-width))]'
				),
				className
			)}
			style={{ '--drawer-width': `${width}px` } as React.CSSProperties}>
			{/* Content */}

			{children}
		</div>
	);

	return createPortal(drawerContent, document.getElementById('drawer-root')!);
}

// Attach the Header component to SideDrawer
SideDrawer.Header = Header;
SideDrawer.Body = Body;
SideDrawer.Footer = Footer;

export default SideDrawer;
