import {
	ChatCenteredText,
	Coin,
	FileText,
	Magnet,
} from '@phosphor-icons/react';
import { NavItem } from '../types';
import { EXTERNAL_ROUTE, LOCAL_ROUTE } from '@/constant/routes/routes.constant';

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
	{ icon: <Coin size={16} />, title: 'Earn', href: LOCAL_ROUTE.EARN.HOME },
	{
		icon: <Magnet size={16} />,
		title: 'Borrow',
		href: LOCAL_ROUTE.BORROW.HOME,
	},
];

export const SIDEBAR_BOTTOM_LINKS: NavItem[] = [
	{
		icon: <ChatCenteredText size={16} />,
		title: 'Feedback',
		href: EXTERNAL_ROUTE.FEEDBACK,
		isExternal: true,
	},
	{
		icon: <FileText size={16} />,
		title: 'Terms of Use',
		href: EXTERNAL_ROUTE.TAC,
		isExternal: true,
	},
];
