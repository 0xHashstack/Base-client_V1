'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface EarnDrawerContextType {
	isOpen: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
	drawerContent: ReactNode;
	setDrawerContent: (content: ReactNode) => void;
}

const initialContext: EarnDrawerContextType = {
	isOpen: false,
	openDrawer: () => {},
	closeDrawer: () => {},
	drawerContent: null,
	setDrawerContent: () => {},
};

// Create the context with default values
const EarnDrawerContext = createContext<EarnDrawerContextType>(initialContext);

interface EarnDrawerProviderProps {
	children: ReactNode;
}

export function EarnDrawerProvider({ children }: EarnDrawerProviderProps) {
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
		<EarnDrawerContext.Provider value={value}>
			{children}
		</EarnDrawerContext.Provider>
	);
}

// Add Consumer property to the EarnDrawerProvider
EarnDrawerProvider.Consumer = EarnDrawerContext.Consumer;

// Custom hook to use the context
export function useEarnDrawer() {
	const context = useContext(EarnDrawerContext);
	if (!context) {
		throw new Error('useEarnDrawer must be used within an EarnDrawerProvider');
	}
	return context;
}
