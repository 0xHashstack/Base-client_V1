'use client';
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useBorrowSpendFormInputs } from '../../../../hooks/useBorrowSpendFormInputs';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import { Text } from '@/components/ui/typography/Text';

/**
 * Component for the borrow spend form inputs
 */
export default function BorrowSpendFormInputs() {
	const { market, userAllLoans, handleMarketChange } =
		useBorrowSpendFormInputs();

	/**
	 * Render function for the market option
	 */
	const renderMarketOption = (option: LoanPosition, isSelected: boolean) => {
		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
				<Image
					src={option.borrowedAsset.logoURI}
					alt={option.borrowedAsset.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>

				<Text.Regular14>{option.borrowedAsset.symbol}</Text.Regular14>
			</div>
		);
	};

	/**
	 * Render function for the selected market
	 */
	const renderSelectedMarket = (selectedLoan: LoanPosition | null) => {
		if (!selectedLoan) return 'Select Market';

		// Format borrowed amount with proper decimals
		const borrowedAmount = selectedLoan.debtTokenAmount.formatBalance(
			selectedLoan.borrowedAsset.decimals
		);

		return (
			<div className='flex items-start gap-2'>
				<Image
					src={selectedLoan.borrowedAsset.logoURI}
					alt={selectedLoan.borrowedAsset.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<div className='flex flex-col'>
					<Text.Medium14>
						{selectedLoan.borrowedAsset.symbol}
					</Text.Medium14>
					<Text.Regular12 textColor={600}>
						Borrow balance: {borrowedAmount} d
						{selectedLoan.borrowedAsset.symbol}
					</Text.Regular12>
				</div>
			</div>
		);
	};

	return (
		<Card className='flex flex-col gap-3 px-6 py-4'>
			<Select.SingleSelect
				label='Borrow Market'
				options={userAllLoans}
				value={market}
				valueKey='loanId'
				labelKey='borrowedAsset.symbol'
				onChange={handleMarketChange}
				renderOption={renderMarketOption}
				renderValue={renderSelectedMarket}
				className='border-none p-0 shadow-none ring-0'
				dropdownClassName='select-primary-displacement'
			/>
		</Card>
	);
}
