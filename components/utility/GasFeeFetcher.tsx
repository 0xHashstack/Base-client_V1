/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useGasPriceStore } from '@/store/useGasPriceStore';
import { useEffect } from 'react';
import { useGasPrice } from 'wagmi';

function GasFeeFetcher() {
	const { data, isLoading, isError } = useGasPrice();
	const { setGasPrice, setIsLoading, setIsError } = useGasPriceStore();

	useEffect(() => {
		if (isLoading) {
			setIsLoading(true);
			return;
		}
		if (isError) {
			setIsError(true);
			return;
		}
		if (data) {
			setGasPrice(data);
			setIsLoading(false);
			setIsError(false);
		}
	}, [data, isLoading, isError]);

	return null;
}

export default GasFeeFetcher;
