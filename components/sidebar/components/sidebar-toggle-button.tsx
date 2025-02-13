import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/store/useLayout.store';
import { SidebarSimple } from '@phosphor-icons/react';
import React from 'react';

function SidebarToggleButton({
	className,
	icon = <SidebarSimple size={16} />,
}: {
	className?: string;
	icon?: React.ReactNode;
}) {
	const { isSidebarOpen, toggleSidebar } = useLayoutStore();
	return (
		<Button
			variant='ghost'
			size='icon'
			className={cn('w-6 h-6', className)}
			onClick={() => toggleSidebar(!isSidebarOpen)}>
			{icon}
		</Button>
	);
}

export default SidebarToggleButton;
