import React from 'react';
import HstkIcon from '../icons/HstkIcon';
import If from '../common/If';
import { Text } from '../ui/typography/Text';
import { cn } from '@/lib/utils';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';
import DashboardLink from '../common/DashboardLink';

interface HstkLogoProps {
	hideTitle?: boolean;
	hideTitleOnMobile?: boolean;
	id?: string;
}

function HstkLogo({
	hideTitle = false,
	hideTitleOnMobile = false,
	id = 'hstk-logo-svg',
}: HstkLogoProps) {
	return (
		<DashboardLink
			href={LOCAL_ROUTE.EARN.HOME}
			className='flex items-center gap-1.5'>
			<HstkIcon id={id} />
			<If isTrue={!hideTitle}>
				<Text.Regular20
					className={cn({ 'hidden md:block': hideTitleOnMobile })}>
					Hashstack
				</Text.Regular20>
			</If>
		</DashboardLink>
	);
}

export default HstkLogo;
