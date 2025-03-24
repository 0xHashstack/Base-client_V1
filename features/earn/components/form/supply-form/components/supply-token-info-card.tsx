import { Text } from '@/components/ui/typography/Text';
import { useSupplyFormStore } from '@/features/earn/store/supply-form.store';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import React from 'react';

/**
 * Props for the SupplyTokenInfoCard component
 */
interface SupplyTokenInfoCardProps {
	/**
	 * Optional token to override the one from the store
	 */
	tokenOverride?: SupplyMarketData | null;
	/**
	 * Exchange rate between token and rToken
	 * @default 100
	 */
	exchangeRate?: number;
	/**
	 * CSS class name for the card
	 */
	className?: string;
}

/**
 * Component that displays token exchange information in a card
 */
const SupplyTokenInfoCard: React.FC<SupplyTokenInfoCardProps> = ({
	tokenOverride,
	exchangeRate = 100,
}) => {
	// Get token from store or use override if provided
	const tokenFromStore = useSupplyFormStore((state) => state.market);
	const token = tokenOverride ?? tokenFromStore;
	const symbol = token?.asset.symbol;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>1 r{symbol}</Text.Regular12>
				<Text.Regular12>
					{exchangeRate} {symbol}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>r{symbol} minted(est)</Text.Regular12>
				<Text.Regular12>
					{exchangeRate} {symbol}
				</Text.Regular12>
			</div>
		</div>
	);
};

export default SupplyTokenInfoCard;
