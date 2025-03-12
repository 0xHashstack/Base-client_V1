'use client';
import React, { ReactNode } from 'react';
import { BorrowDrawerProvider } from '@/features/borrow/context/borrow-drawer.context';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowProvider } from '../context/borrow.context';
import BorrowAddCollateralForm from './form/borrow-add-collateral-form';

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
					open={isOpen}
					setOpen={(open) => {
						if (!open) closeDrawer();
					}}
					hideHeader>
					{drawerContent || (
						<BorrowAddCollateralForm
							token={{
								name: 'Ethereum',
								symbol: 'ETH',
								address: '0x123',
								decimals: 18,
								iconUrl: '/images/tokens/eth.svg',
								availableCollateral: 1.5,
							}}
						/>
					)}
				</SideDrawer>
			)}
		</BorrowDrawerProvider.Consumer>
	);
}

export default BorrowWrapper;
