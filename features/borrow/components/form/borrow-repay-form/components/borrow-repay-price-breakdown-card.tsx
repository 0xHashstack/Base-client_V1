import { Text } from '@/components/ui/typography/Text';
import { useBorrowRepayForm } from '../../../../hooks/useBorrowRepayForm';
import React from 'react';

/**
 * Component that displays the price breakdown for repaying
 */
function BorrowRepayPriceBreakdownCard() {
	const { marketLoan, fee } = useBorrowRepayForm();

	// Calculate values based on amount and token
	const numericAmount = parseFloat('0') || 0;
	const tokenPrice =
		marketLoan?.borrowedAsset.symbol === 'ETH' ? 3000
		: marketLoan?.borrowedAsset.symbol === 'USDC' ? 1
		: 60000;
	const usdValue = numericAmount * (tokenPrice || 0);

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Repay Amount</Text.Regular12>
				<Text.Regular12>
					{numericAmount.toFixed(4)}{' '}
					{marketLoan?.borrowedAsset.symbol || ''}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>USD Value</Text.Regular12>
				<Text.Regular12>${usdValue.toFixed(2)}</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Fee</Text.Regular12>
				<Text.Regular12>
					{fee} {marketLoan?.borrowedAsset.symbol || ''}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Total</Text.Regular12>
				<Text.Regular12>
					{(numericAmount + parseFloat(fee)).toFixed(4)}{' '}
					{marketLoan?.borrowedAsset.symbol || ''}
				</Text.Regular12>
			</div>
		</div>
	);
}

export default BorrowRepayPriceBreakdownCard;
