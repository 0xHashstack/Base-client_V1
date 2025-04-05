import { Text } from '@/components/ui/typography/Text';
import { useSupplyFormStore } from '@/features/earn/store/supply-form.store';
import React from 'react';
import '@prototype/bigint.prototype';
import { DECIMALS } from '@/constant/web3/decimal.constant';
/**
 * Component that displays APR information in an accordion card
 */
const SupplyFormAPR: React.FC = () => {
	const market = useSupplyFormStore((state) => state.market);

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>APR</Text.Regular12>
				<Text.Regular12>
					{market?.state?.annualApy.formatToString(DECIMALS.APR)}%
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12 textColor={500}>Supply APR</Text.Regular12>
				<Text.Regular12>
					{market?.state?.annualApy.formatToString(DECIMALS.APR)}%
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12 textColor={500}>HSTK Rewards</Text.Regular12>
				<Text.Regular12>{0}%</Text.Regular12>
			</div>
		</div>
	);
};

export default SupplyFormAPR;
