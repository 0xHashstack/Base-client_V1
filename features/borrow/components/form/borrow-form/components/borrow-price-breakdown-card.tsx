import { Text } from '@/components/ui/typography/Text';

import React from 'react';
import { useBorrowFormStore } from '@/features/borrow/store/borrow-form.store';
import GasFeeText from '@/components/utility/GasFeeText';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import If from '@/components/common/If';

/**
 * Component that displays the price breakdown for borrowing
 */
function BorrowPriceBreakdownCard() {
	const { amount, collateralMarket, borrowMarket } = useBorrowFormStore(
		(state) => state
	);

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Collateral</Text.Regular12>
				<Text.Regular12>
					<If isTrue={!collateralMarket}>
						<span>-</span>
						<span>
							{amount || 0} {collateralMarket?.symbol}
						</span>
					</If>
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Borrow APR</Text.Regular12>
				<Text.Regular12>
					{borrowMarket?.borrowApr?.formatToString(DECIMALS.APR)}%
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Health factor</Text.Regular12>
				<Text.Regular12>1.5</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Gas fees</Text.Regular12>
				<GasFeeText />
			</div>
		</div>
	);
}

export default BorrowPriceBreakdownCard;
