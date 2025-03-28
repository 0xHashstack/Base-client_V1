'use client';
import React from 'react';
import { Text } from '../ui/typography/Text';
import { Button } from '../ui/button';
import useCustomRouter from '@/hooks/useCustomRouter';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';

function NotFoundBase() {
	const { dashboardRouter } = useCustomRouter();

	return (
		<div className='flex w-full flex-col items-center justify-center gap-10  h-full'>
			<div className='flex flex-col items-center gap-2 text-center'>
				<Text.Medium20>Not Found</Text.Medium20>
				<Text.Regular14>
					We could not find the page you were looking for.
				</Text.Regular14>
			</div>
			<Button onClick={() => dashboardRouter.push(LOCAL_ROUTE.EARN.HOME)}>
				Go to Home
			</Button>
		</div>
	);
}

export default NotFoundBase;
