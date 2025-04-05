import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { useBorrowRepayFormStore } from '@/features/borrow/store/borrow-repay-form.store';
import '@prototype/bigint.prototype';
import React from 'react';

function BorrowRepayDetailsCard() {
	const marketLoan = useBorrowRepayFormStore((state) => state.marketLoan);

	return (
		<Card className='flex flex-col gap-3 p-6'>
			<div className='flex justify-between items-center'>
				<Text.Regular12>Borrow Amount</Text.Regular12>
				<Text.Regular12>
					${marketLoan?.borrowedValue.formatBalance(DECIMALS.PRICE)}
				</Text.Regular12>
			</div>
			<Separator />
			<div className='flex justify-between items-center'>
				<Text.Regular12>
					{marketLoan?.collateralAsset.symbol} unlocked
				</Text.Regular12>
				<Text.Regular12>
					{marketLoan?.collateralAsset.collateralAmount.formatBalance(
						marketLoan?.collateralAsset.decimals
					)}{' '}
				</Text.Regular12>
			</div>
		</Card>
	);
}

export default BorrowRepayDetailsCard;
