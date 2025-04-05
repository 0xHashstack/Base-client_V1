import { Text } from '@/components/ui/typography/Text';

import React from 'react';
import { useBorrowRepayFormStore } from '@/features/borrow/store/borrow-repay-form.store';
import GasFeeText from '@/components/utility/GasFeeText';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { formatToReadableValue } from '@/utils/web3';

/**
 * Component that displays the price breakdown for repaying
 */
function BorrowRepayPriceBreakdownCard() {
	const { marketLoan } = useBorrowRepayFormStore((state) => state);

	const valueInUSD =
		!marketLoan ? 0 : (
			marketLoan.repayFees?.format(marketLoan.borrowedAsset.decimals) *
			marketLoan.borrowedAsset.priceUSD.format(DECIMALS.PRICE)
		);

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Repay Amount</Text.Regular12>
				<Text.Regular12>
					{marketLoan?.repayFees?.formatBalance(
						marketLoan?.borrowedAsset.decimals
					)}{' '}
					{marketLoan?.borrowedAsset.symbol}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>USD Value</Text.Regular12>
				<Text.Regular12>
					${formatToReadableValue(valueInUSD)}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Gas Fee</Text.Regular12>
				<GasFeeText />
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Total Fee</Text.Regular12>
				<GasFeeText />
			</div>
		</div>
	);
}

export default BorrowRepayPriceBreakdownCard;
