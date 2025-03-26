import { EarnDrawerConsumer } from '@/features/earn/components/earn-wrapper';
import { EarnDrawerProvider } from '@/features/earn/context/earn-drawer.context';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
	return (
		<EarnDrawerProvider>
			<EarnDrawerConsumer>{children}</EarnDrawerConsumer>
		</EarnDrawerProvider>
	);
}

export default layout;
