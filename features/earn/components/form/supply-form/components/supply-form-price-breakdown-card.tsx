import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';
import React from 'react';

/**
 * Fee breakdown information for the supply form
 */
type FeeInfo = {
	networkFee: string;
	dappFee: string;
	totalFeePercentage: string;
};

/**
 * Default fee information
 */
const DEFAULT_FEE_INFO: FeeInfo = {
	networkFee: '0.0003 ETH',
	dappFee: '0.15%',
	totalFeePercentage: '23.9%',
};

/**
 * Props for the SupplyFormPriceBreakdownCard component
 */
interface SupplyFormPriceBreakdownCardProps {
	/**
	 * Fee information to display
	 */
	feeInfo?: FeeInfo;
}

/**
 * Component that displays a breakdown of fees in an accordion card
 */
const SupplyFormPriceBreakdownCard: React.FC<
	SupplyFormPriceBreakdownCardProps
> = ({ feeInfo = DEFAULT_FEE_INFO }) => {
	const { networkFee, dappFee, totalFeePercentage } = feeInfo;

	const cardHeader = (
		<div className='flex flex-1 items-center justify-between'>
			<Text.Medium12>Fees</Text.Medium12>
			<Text.Regular12>{totalFeePercentage}</Text.Regular12>
		</div>
	);

	return (
		<CardAccordion header={cardHeader}>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-1 items-center justify-between'>
					<Text.Regular12 textColor={500}>
						Network fees
					</Text.Regular12>
					<Text.Regular12>{networkFee}</Text.Regular12>
				</div>
				<div className='flex flex-1 items-center justify-between'>
					<Text.Regular12 textColor={500}>Dapp Fees</Text.Regular12>
					<Text.Regular12>{dappFee}</Text.Regular12>
				</div>
			</div>
		</CardAccordion>
	);
};

export default SupplyFormPriceBreakdownCard;
