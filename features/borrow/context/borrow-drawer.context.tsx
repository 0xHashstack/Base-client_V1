'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface BorrowDrawerContextType {
	isOpen: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
	drawerContent: ReactNode;
	setDrawerContent: (content: ReactNode) => void;
}

const initialContext: BorrowDrawerContextType = {
	isOpen: false,
	openDrawer: () => {},
	closeDrawer: () => {},
	drawerContent: null,
	setDrawerContent: () => {},
};

// Create the context with default values
const BorrowDrawerContext = createContext<BorrowDrawerContextType>(initialContext);

interface BorrowDrawerProviderProps {
	children: ReactNode;
}

/**
 * Provider component for the borrow drawer context
 */
export function BorrowDrawerProvider({ children }: BorrowDrawerProviderProps) {
	// State for the drawer
	const [isOpen, setIsOpen] = useState(false);
	const [drawerContent, setDrawerContent] = useState<ReactNode>(null);

	// Functions to open and close the drawer
	const openDrawer = () => setIsOpen(true);
	const closeDrawer = () => {
		setIsOpen(false);
	};

	// Context value
	const value = {
		isOpen,
		openDrawer,
		closeDrawer,
		drawerContent,
		setDrawerContent,
	};

	return (
		<BorrowDrawerContext.Provider value={value}>
			{children}
		</BorrowDrawerContext.Provider>
	);
}

// Add Consumer property to the BorrowDrawerProvider
BorrowDrawerProvider.Consumer = BorrowDrawerContext.Consumer;

/**
 * Hook to use the borrow drawer context
 */
export function useBorrowDrawer() {
	const context = useContext(BorrowDrawerContext);
	if (context === undefined) {
		throw new Error('useBorrowDrawer must be used within a BorrowDrawerProvider');
	}
	return context;
}
