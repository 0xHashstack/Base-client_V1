'use client';
import React, { ReactNode } from 'react';
import { EarnDrawerProvider } from '@/features/earn/context/earn-drawer.context';
import SideDrawer from '@/components/drawer/side-drawer';
import { EarnProvider } from '../context/earn.context';

interface EarnWrapperProps {
	children: ReactNode;
}

/**
 * Wrapper component for the Earn feature that provides the EarnDrawerContext
 * and renders the SideDrawer
 */
function EarnWrapper({ children }: EarnWrapperProps) {
	return <EarnProvider>{children}</EarnProvider>;
}

/**
 * Consumer component that renders the SideDrawer based on the EarnDrawerContext
 */
export function EarnDrawerConsumer({ children }: { children: ReactNode }) {
	return (
		<>
			{children}
			<EarnDrawerRenderer />
		</>
	);
}

/**
 * Component that renders the SideDrawer based on the EarnDrawerContext
 */
function EarnDrawerRenderer() {
	return (
		<EarnDrawerProvider.Consumer>
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
		</EarnDrawerProvider.Consumer>
	);
}

export default EarnWrapper;
