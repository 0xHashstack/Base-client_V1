import { Text } from '@/components/ui/typography/Text';
import { useBorrowForm } from '../../../../hooks/useBorrowForm';
import React from 'react';

/**
 * Component that displays the price breakdown for borrowing
 */
function BorrowPriceBreakdownCard() {
	const { amount, token } = useBorrowForm();

	// Calculate values based on amount and token
	const numericAmount = parseFloat(amount) || 0;
	const tokenPrice =
		token?.symbol === 'ETH' ? 3000
		: token?.symbol === 'USDC' ? 1
		: 60000;
	const usdValue = numericAmount * (tokenPrice || 0);

	// Calculate interest rate (example: 5% APR)
	const interestRate = 5;
	const annualInterest = usdValue * (interestRate / 100);

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Collateral</Text.Regular12>
				<Text.Regular12>
					{numericAmount.toFixed(4)} {token?.symbol || ''}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Borrow APR</Text.Regular12>
				<Text.Regular12>{interestRate}%</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Health factor</Text.Regular12>
				<Text.Regular12>1.5</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Annual interest</Text.Regular12>
				<Text.Regular12>${annualInterest.toFixed(2)}</Text.Regular12>
			</div>
		</div>
	);
}

export default BorrowPriceBreakdownCard;
