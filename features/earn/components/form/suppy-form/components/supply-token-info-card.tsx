import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';
import { useSupplyFormStore } from '@/features/earn/store/supply-form.store';
import React from 'react';

function SupplyTokenInfoCard() {
	const token = useSupplyFormStore((state) => state.token);
	const cardHeader = (
		<div className='flex flex-1 items-center justify-between'>
			<Text.Regular12>1 r{token?.symbol}</Text.Regular12>
			<Text.Regular12>100 {token?.symbol}</Text.Regular12>
		</div>
	);
	return (
		<CardAccordion
			className='bg-card-secondary border-none'
			header={cardHeader}
			collapsible={false}>
			<div className='flex items-center justify-between'>
				<Text.Regular12>r{token?.symbol} minted(est)</Text.Regular12>
				<Text.Regular12>100 {token?.symbol}</Text.Regular12>
			</div>
		</CardAccordion>
	);
}

export default SupplyTokenInfoCard;
