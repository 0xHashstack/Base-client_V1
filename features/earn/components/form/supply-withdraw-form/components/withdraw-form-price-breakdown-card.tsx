import { Text } from '@/components/ui/typography/Text';
import React from 'react';
import '@prototype/bigint.prototype';
import GasFeeText from '@/components/utility/GasFeeText';

const WithdrawFormPriceBreakdownCard: React.FC = () => {
	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Medium12>Fees</Text.Medium12>
				<GasFeeText />
			</div>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12 textColor={600}>Network fees</Text.Regular12>
				<GasFeeText />
			</div>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12 textColor={600}>Withdraw Fees</Text.Regular12>
				<Text.Regular12>{0}</Text.Regular12>
			</div>
		</div>
	);
};

export default WithdrawFormPriceBreakdownCard;
