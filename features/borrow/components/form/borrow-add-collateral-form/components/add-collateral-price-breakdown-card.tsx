import { Text } from '@/components/ui/typography/Text';
import { useBorrowAddCollateralForm } from '../../../../hooks/useBorrowAddCollateralForm';
import React from 'react';

/**
 * Component that displays the price breakdown for adding collateral
 */
function AddCollateralPriceBreakdownCard() {
	const { amount, token } = useBorrowAddCollateralForm();

	// Calculate values based on amount and token
	const numericAmount = parseFloat(amount) || 0;
	const tokenPrice =
		token?.symbol === 'ETH' ? 3000
		: token?.symbol === 'USDC' ? 1
		: 60000;
	const usdValue = numericAmount * (tokenPrice || 0);

	// Calculate new borrowing power (70% of collateral value)
	const newBorrowingPower = usdValue * 0.7;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Fees</Text.Regular12>
				<Text.Regular12>
					{numericAmount.toFixed(4)} {token?.symbol || ''}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Effective apr</Text.Regular12>
				<Text.Regular12>${usdValue.toFixed(2)}</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Health factor</Text.Regular12>
				<Text.Regular12>${newBorrowingPower.toFixed(2)}</Text.Regular12>
			</div>
		</div>
	);
}

export default AddCollateralPriceBreakdownCard;
