import { BorrowDrawerConsumer } from '@/features/borrow/components/borrow-wrapper';
import { BorrowDrawerProvider } from '@/features/borrow/context/borrow-drawer.context';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
	return (
		<BorrowDrawerProvider>
			<BorrowDrawerConsumer>{children}</BorrowDrawerConsumer>
		</BorrowDrawerProvider>
	);
}

export default layout;
