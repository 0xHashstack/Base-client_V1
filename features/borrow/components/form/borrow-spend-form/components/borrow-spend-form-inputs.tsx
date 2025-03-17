'use client';
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useBorrowSpendForm } from '../../../../hooks/useBorrowSpendForm';
import { HstkToken } from '@/types/web3/token.types';
import { Text } from '@/components/ui/typography/Text';

/**
 * Component for the borrow spend form inputs
 */
export default function BorrowSpendFormInputs() {
	const { market, borrowTokens, handleMarketChange } = useBorrowSpendForm();

	/**
	 * Render function for the market option
	 */
	const renderMarketOption = (option: HstkToken, isSelected: boolean) => {
		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}>
				<Image
					src={option.iconUrl}
					alt={option.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>

				<Text.Regular14>{option.symbol}</Text.Regular14>
			</div>
		);
	};

	/**
	 * Render function for the selected market
	 */
	const renderSelectedMarket = (selectedToken: HstkToken | null) => {
		if (!selectedToken) return 'Select Market';

		return (
			<div className='flex items-start gap-2'>
				<Image
					src={selectedToken.iconUrl}
					alt={selectedToken.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<div className='flex flex-col'>
					<Text.Medium14>{selectedToken.symbol}</Text.Medium14>
					<Text.Regular12 textColor={500}>
						Borrow balance: 54.15 USDC
					</Text.Regular12>
				</div>
			</div>
		);
	};

	return (
		<Card className='flex flex-col gap-3 px-6 py-4'>
			<Select.SingleSelect
				label='Borrow Market'
				options={borrowTokens}
				value={market}
				valueKey='address'
				labelKey='symbol'
				onChange={handleMarketChange}
				renderOption={renderMarketOption}
				renderValue={renderSelectedMarket}
				className='border-none p-0 shadow-none ring-0'
			/>
		</Card>
	);
}
