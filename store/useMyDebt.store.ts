import { create } from 'zustand';

interface MyDebtPosition {
	tokenAddress: string;
	amount: string;
	healthFactor: number;
}

interface MyDebtStore {
	myDebtPositions: MyDebtPosition[];
	setMyDebtPositions: (positions: MyDebtPosition[]) => void;
}

export const useMyDebtStore = create<MyDebtStore>((set) => ({
	myDebtPositions: [],
	setMyDebtPositions: (positions) => set({ myDebtPositions: positions }),
}));
