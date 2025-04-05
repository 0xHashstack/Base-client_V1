'use client';
import React from 'react';
import { Skeleton } from '../ui/skeleton/skeleton';
import If from '../common/If';
import { Text } from '../ui/typography/Text';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { GAS_TOKEN } from '@/constant/web3/gas.constant';
import { useGasPriceStore } from '@/store/useGasPriceStore';

function GasFeeText() {
	const { gasPrice, isLoading } = useGasPriceStore();
	return (
		<If isTrue={isLoading}>
			<Skeleton className='w-40 h-4' />
			<Text.Regular12>
				{gasPrice.format(DECIMALS.GAS).toFixed(18)} {GAS_TOKEN}
			</Text.Regular12>
		</If>
	);
}

export default GasFeeText;
