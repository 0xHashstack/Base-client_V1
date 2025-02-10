import { ReactNode } from 'react';

export interface NavItem {
	icon: ReactNode;
	title: string;
	href: string;
	isExternal?: boolean;
}

export interface SidebarProps {
	className?: string;
}

export interface SidebarHeaderProps {
	isSidebarOpen: boolean;
}

export interface SidebarNavProps {
	items: NavItem[];
	isSidebarOpen: boolean;
}

export interface SidebarThemeToggleProps {
	isSidebarOpen: boolean;
	onToggle: (value: boolean) => void;
}
