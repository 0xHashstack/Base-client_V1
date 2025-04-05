import { create } from 'zustand';

interface GasPriceState {
	gasPrice: bigint;
	setGasPrice: (gasPrice: bigint) => void;
	isLoading: boolean;
	isError: boolean;
	setIsLoading: (isLoading: boolean) => void;
	setIsError: (isError: boolean) => void;
}

export const useGasPriceStore = create<GasPriceState>((set) => ({
	gasPrice: BigInt(0),
	setGasPrice: (gasPrice) => set({ gasPrice }),
	isLoading: false,
	isError: false,
	setIsLoading: (isLoading) => set({ isLoading }),
	setIsError: (isError) => set({ isError }),
}));
