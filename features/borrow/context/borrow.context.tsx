/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { createContext, useContext } from 'react';

interface BorrowContextType {}

const BorrowContext = createContext<BorrowContextType | undefined>(undefined);

export function BorrowProvider({ children }: { children: React.ReactNode }) {
	return (
		<BorrowContext.Provider value={{}}>{children}</BorrowContext.Provider>
	);
}

export const useBorrowContext = () => {
	const context = useContext(BorrowContext);
	if (context === undefined) {
		throw new Error(
			'useBorrowContext must be used within a BorrowProvider'
		);
	}
	return context;
};
