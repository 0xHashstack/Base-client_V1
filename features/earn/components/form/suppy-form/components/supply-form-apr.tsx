import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';
import React from 'react';

function SupplyFormAPR() {
	const cardHeader = (
		<div className='flex flex-1 items-center justify-between'>
			<Text.Regular12>APR</Text.Regular12>
			<Text.Regular12>0.15%</Text.Regular12>
		</div>
	);
	return (
		<CardAccordion
			header={cardHeader}
			collapsible={false}>
			<div className='flex flex-col gap-3'>
				<div className='flex items-center justify-between'>
					<Text.Regular12 textColor={500}>Supply APR</Text.Regular12>
					<Text.Regular12>5.73%</Text.Regular12>
				</div>
				<div className='flex items-center justify-between'>
					<Text.Regular12 textColor={500}>
						HSTK Rewards
					</Text.Regular12>
					<Text.Regular12>5.73%</Text.Regular12>
				</div>
			</div>
		</CardAccordion>
	);
}

export default SupplyFormAPR;
