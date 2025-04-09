import { Text } from '@/components/ui/typography/Text';
import React from 'react';
import { useSupplyWithdrawFormStore } from '@/features/earn/store/supply-withdraw-form.store';

const WithdrawTokenInfoCard: React.FC = () => {
	// Get token from store or use override if provided
	const supplyPosition = useSupplyWithdrawFormStore(
		(state) => state.supplyPosition
	);
	const amount = useSupplyWithdrawFormStore((state) => state.amount);

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>
					1 {supplyPosition?.supplyAsset.symbol}
				</Text.Regular12>
				<Text.Regular12>
					1 {supplyPosition?.underlyingAsset.symbol}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>
					{supplyPosition?.supplyAsset.symbol} minted(est)
				</Text.Regular12>
				<Text.Regular12>
					{amount || 0} {supplyPosition?.supplyAsset.symbol}
				</Text.Regular12>
			</div>
		</div>
	);
};

export default WithdrawTokenInfoCard;
