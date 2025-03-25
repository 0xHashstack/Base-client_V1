/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { createContext, useContext } from 'react';

interface EarnContextType {}

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ children }: { children: React.ReactNode }) {
	return <EarnContext.Provider value={{}}>{children}</EarnContext.Provider>;
}

export function useEarnContext() {
	const context = useContext(EarnContext);
	if (context === undefined) {
		throw new Error('useEarnContext must be used within an EarnProvider');
	}
	return context;
}
