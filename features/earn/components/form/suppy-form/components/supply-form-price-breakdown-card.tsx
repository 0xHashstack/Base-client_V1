import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';
import React from 'react';

function SupplyFormPriceBreakdownCard() {
	const cardHeader = (
		<div className='flex flex-1 items-center justify-between'>
			<Text.Medium12>Fees</Text.Medium12>
			<Text.Regular12>23.9%</Text.Regular12>
		</div>
	);
	return (
		<CardAccordion header={cardHeader}>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-1 items-center justify-between'>
					<Text.Regular12 textColor={500}>
						Network fees
					</Text.Regular12>
					<Text.Regular12>0.0003 ETH</Text.Regular12>
				</div>
				<div className='flex flex-1 items-center justify-between'>
					<Text.Regular12 textColor={500}>Dapp Fees</Text.Regular12>
					<Text.Regular12>0.15%</Text.Regular12>
				</div>
			</div>
		</CardAccordion>
	);
}

export default SupplyFormPriceBreakdownCard;
