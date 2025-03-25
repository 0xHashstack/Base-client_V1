import { Text } from '@/components/ui/typography/Text';
import { useSupplyWithdrawForm } from '../../../../hooks/useSupplyWithdrawForm';
import React from 'react';
import { SupplyPosition } from '@/types/web3/supply-market.types';

/**
 * Props for the WithdrawTokenInfoCard component
 */
interface WithdrawTokenInfoCardProps {
	/**
	 * Optional token to override the one from the store
	 */
	tokenOverride?: SupplyPosition | null;
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
const WithdrawTokenInfoCard: React.FC<WithdrawTokenInfoCardProps> = ({
	tokenOverride,
	exchangeRate = 100,
}) => {
	// Get token from store or use override if provided
	const { token: storeToken } = useSupplyWithdrawForm();
	const token = tokenOverride ?? storeToken;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>
					1 r{token?.underlyingAsset.symbol}
				</Text.Regular12>
				<Text.Regular12>
					{exchangeRate} {token?.underlyingAsset.symbol}
				</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12>
					r{token?.underlyingAsset.symbol} minted(est)
				</Text.Regular12>
				<Text.Regular12>
					{exchangeRate} {token?.underlyingAsset.symbol}
				</Text.Regular12>
			</div>
		</div>
	);
};

export default WithdrawTokenInfoCard;
