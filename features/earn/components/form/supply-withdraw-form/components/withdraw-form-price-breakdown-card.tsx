'use client';
import React, { useMemo } from 'react';
import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';

/**
 * Fee information for the withdraw form
 */
type FeeInfo = {
	networkFee: string;
	withdrawFee: string;
	totalFees: string;
};

/**
 * Default fee information
 */
const DEFAULT_FEE_INFO: FeeInfo = {
	networkFee: '$0.12',
	withdrawFee: '$0.00',
	totalFees: '$0.12',
};

/**
 * Props for the WithdrawFormPriceBreakdownCard component
 */
interface WithdrawFormPriceBreakdownCardProps {
	/**
	 * Fee information to display
	 */
	feeInfo?: FeeInfo;
	/**
	 * CSS class name for the card
	 */
	className?: string;
}

/**
 * Component that displays fee information in an accordion card
 */
const WithdrawFormPriceBreakdownCard: React.FC<
	WithdrawFormPriceBreakdownCardProps
> = ({ feeInfo = DEFAULT_FEE_INFO, className }) => {
	const { networkFee, withdrawFee, totalFees } = feeInfo;

	// Memoize the header to prevent unnecessary re-renders
	const cardHeader = useMemo(
		() => (
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>Fees</Text.Regular12>
				<Text.Regular12>{totalFees}</Text.Regular12>
			</div>
		),
		[totalFees]
	);

	return (
		<CardAccordion
			header={cardHeader}
			className={className}>
			<div className='flex flex-col gap-3'>
				<div className='flex items-center justify-between'>
					<Text.Regular12 textColor={500}>Network Fee</Text.Regular12>
					<Text.Regular12>{networkFee}</Text.Regular12>
				</div>
				<div className='flex items-center justify-between'>
					<Text.Regular12 textColor={500}>
						Withdraw Fee
					</Text.Regular12>
					<Text.Regular12>{withdrawFee}</Text.Regular12>
				</div>
			</div>
		</CardAccordion>
	);
};

export default WithdrawFormPriceBreakdownCard;
