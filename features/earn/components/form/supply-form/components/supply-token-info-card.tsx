import { Text } from '@/components/ui/typography/Text';
import { useSupplyFormStore } from '@/features/earn/store/supply-form.store';
import React from 'react';

/**
 * Component that displays token exchange information in a card
 */
const SupplyTokenInfoCard: React.FC = () => {
	// Get token from store or use override if provided
	const tokenFromStore = useSupplyFormStore((state) => state.market);
	const amount = useSupplyFormStore((state) => state.amount);
	const token = tokenFromStore;
	const symbol = token?.asset.symbol;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>1 r{symbol}</Text.Regular12>
				<Text.Regular12>1 {symbol}</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>r{symbol} minted(est)</Text.Regular12>
				<Text.Regular12>
					{amount || 0} r{symbol}
				</Text.Regular12>
			</div>
		</div>
	);
};

export default SupplyTokenInfoCard;
