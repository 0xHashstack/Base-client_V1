'use client';
import React, { useMemo } from 'react';
import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';
import { useSupplyWithdrawForm } from '../../../../hooks/useSupplyWithdrawForm';

/**
 * Props for the WithdrawTokenInfoCard component
 */
interface WithdrawTokenInfoCardProps {
	/**
	 * Token override for the card
	 */
	tokenOverride?: {
		name: string;
		symbol: string;
		address: string;
		iconUrl: string;
		decimals: number;
	} | null;
	/**
	 * Exchange rate for the token
	 */
	exchangeRate?: string;
	/**
	 * CSS class name for the card
	 */
	className?: string;
}

/**
 * Default exchange rate
 */
const DEFAULT_EXCHANGE_RATE = '1 HSTK = $1.00';

/**
 * Component that displays token information in an accordion card
 */
const WithdrawTokenInfoCard: React.FC<WithdrawTokenInfoCardProps> = ({
	tokenOverride,
	exchangeRate = DEFAULT_EXCHANGE_RATE,
	className = 'bg-card-secondary border-none',
}) => {
	const { token: storeToken } = useSupplyWithdrawForm();
	const token = tokenOverride ?? storeToken;

	// Memoize the header to prevent unnecessary re-renders
	const cardHeader = useMemo(
		() => (
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>1 r{token?.symbol}</Text.Regular12>
				<Text.Regular12>
					{exchangeRate} {token?.symbol}
				</Text.Regular12>
			</div>
		),
		[exchangeRate, token?.symbol]
	);

	// Don't render if there's no token
	if (!token) return null;

	return (
		<CardAccordion
			header={cardHeader}
			className={className}
			collapsible={false}>
			<div className='flex items-center justify-between'>
				<Text.Regular12>r{token?.symbol} minted(est)</Text.Regular12>
				<Text.Regular12>
					{exchangeRate} {token?.symbol}
				</Text.Regular12>
			</div>
		</CardAccordion>
	);
};

export default WithdrawTokenInfoCard;
