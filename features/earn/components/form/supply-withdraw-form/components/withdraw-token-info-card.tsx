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
	className,
}) => {
	const { token: storeToken } = useSupplyWithdrawForm();
	const token = tokenOverride ?? storeToken;

	// Memoize the header to prevent unnecessary re-renders
	const cardHeader = useMemo(
		() => (
			<div className='flex flex-1 items-center justify-between'>
				<Text.Regular12>Token Info</Text.Regular12>
				<Text.Regular12>{exchangeRate}</Text.Regular12>
			</div>
		),
		[exchangeRate]
	);

	// Don't render if there's no token
	if (!token) return null;

	return (
		<CardAccordion
			header={cardHeader}
			className={className}
			collapsible={false}>
			<div className='flex flex-col gap-3'>
				<div className='flex items-center justify-between'>
					<Text.Regular12 textColor={500}>
						Token Address
					</Text.Regular12>
					<Text.Regular12>
						{token.address.slice(0, 6)}...{token.address.slice(-4)}
					</Text.Regular12>
				</div>
				<div className='flex items-center justify-between'>
					<Text.Regular12 textColor={500}>Decimals</Text.Regular12>
					<Text.Regular12>{token.decimals}</Text.Regular12>
				</div>
			</div>
		</CardAccordion>
	);
};

export default WithdrawTokenInfoCard;
