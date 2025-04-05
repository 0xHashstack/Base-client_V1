import { Text } from '@/components/ui/typography/Text';
import React from 'react';

import { useBorrowAddCollateralFormStore } from '@/features/borrow/store/borrow-add-collateral-form.store';
import GasFeeText from '@/components/utility/GasFeeText';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';
/**
 * Component that displays the price breakdown for adding collateral
 */
function AddCollateralPriceBreakdownCard() {
	const { collateralAsset, loanPosition, amount } =
		useBorrowAddCollateralFormStore((state) => state);
	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Collateral</Text.Regular12>
				<Text.Regular12>
					<If isTrue={!collateralAsset}>
						<span>-</span>
						<span>
							{amount || 0} {collateralAsset?.symbol}
						</span>
					</If>
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Effective apr</Text.Regular12>
				<Text.Regular12>
					{loanPosition?.rateInfo?.effectiveRate?.format(
						DECIMALS.APR
					)}
					%
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Health factor</Text.Regular12>
				<Text.Regular12>
					{loanPosition?.positionHealth.healthFactor?.format(
						DECIMALS.HEALTH_FACTOR
					)}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>Gas fees</Text.Regular12>
				<GasFeeText />
			</div>
		</div>
	);
}

export default AddCollateralPriceBreakdownCard;
