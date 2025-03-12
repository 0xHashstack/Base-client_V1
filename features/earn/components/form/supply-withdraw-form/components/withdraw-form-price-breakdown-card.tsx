import { Text } from '@/components/ui/typography/Text';
import React from 'react';

/**
 * Fee breakdown information for the withdraw form
 */
type FeeInfo = {
	networkFee: string;
	withdrawFee: string;
	totalFeePercentage: string;
};

/**
 * Default fee information
 */
const DEFAULT_FEE_INFO: FeeInfo = {
	networkFee: '0.0003 ETH',
	withdrawFee: '0.15%',
	totalFeePercentage: '23.9%',
};

/**
 * Props for the WithdrawFormPriceBreakdownCard component
 */
interface WithdrawFormPriceBreakdownCardProps {
	/**
	 * Fee information to display
	 */
	feeInfo?: FeeInfo;
}

/**
 * Component that displays a breakdown of fees in an accordion card
 */
const WithdrawFormPriceBreakdownCard: React.FC<
	WithdrawFormPriceBreakdownCardProps
> = ({ feeInfo = DEFAULT_FEE_INFO }) => {
	const { networkFee, withdrawFee, totalFeePercentage } = feeInfo;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Medium12>Fees</Text.Medium12>
				<Text.Regular12>{totalFeePercentage}</Text.Regular12>
			</div>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12 textColor={500}>Network fees</Text.Regular12>
				<Text.Regular12>{networkFee}</Text.Regular12>
			</div>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12 textColor={500}>Withdraw Fees</Text.Regular12>
				<Text.Regular12>{withdrawFee}</Text.Regular12>
			</div>
		</div>
	);
};

export default WithdrawFormPriceBreakdownCard;
