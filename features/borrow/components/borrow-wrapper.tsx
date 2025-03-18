'use client';
import React, { ReactNode } from 'react';
import { BorrowDrawerProvider } from '@/features/borrow/context/borrow-drawer.context';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowProvider } from '../context/borrow.context';

interface BorrowWrapperProps {
	children: ReactNode;
}

/**
 * Wrapper component for the Borrow feature that provides the BorrowDrawerContext
 * and renders the SideDrawer
 */
function BorrowWrapper({ children }: BorrowWrapperProps) {
	return (
		<BorrowProvider>
			<BorrowDrawerProvider>
				<BorrowDrawerConsumer>{children}</BorrowDrawerConsumer>
			</BorrowDrawerProvider>
		</BorrowProvider>
	);
}

/**
 * Consumer component that renders the SideDrawer based on the BorrowDrawerContext
 */
function BorrowDrawerConsumer({ children }: { children: ReactNode }) {
	return (
		<>
			{children}
			<BorrowDrawerRenderer />
		</>
	);
}

/**
 * Component that renders the SideDrawer based on the BorrowDrawerContext
 */
function BorrowDrawerRenderer() {
	return (
		<BorrowDrawerProvider.Consumer>
			{({ isOpen, closeDrawer, drawerContent }) => (
				<SideDrawer
					open={isOpen && drawerContent !== null}
					setOpen={(open) => {
						if (!open) closeDrawer();
					}}
					hideHeader>
					{drawerContent || null}
				</SideDrawer>
			)}
		</BorrowDrawerProvider.Consumer>
	);
}

export default BorrowWrapper;
