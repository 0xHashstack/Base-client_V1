'use client';
import React, { useMemo } from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import {
	SupplyFormContextProvider,
	useSupplyFormStore,
} from '../../../context/supply-form.context';
import { useSupplyForm } from '../../../hooks/useSupplyForm';
import SupplyFormInputs from './components/supply-form-inputs';
import SupplyTokenInfoCard from './components/supply-token-info-card';
import SupplyFormAPR from './components/supply-form-apr';
import SupplyFormPriceBreakdownCard from './components/supply-form-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import { WalletTokenProvider } from '@/context/wallet-token-provider';

interface SupplyFormProps {
	market: SupplyMarketData;
}

/**
 * Form component for supplying tokens to the protocol
 */
function SupplyForm({ market }: SupplyFormProps) {
	return (
		<SupplyFormContextProvider market={market}>
			<SupplyFormWithTokenProvider market={market} />
		</SupplyFormContextProvider>
	);
}

function SupplyFormWithTokenProvider({ market }: SupplyFormProps) {
	const storeMarket = useSupplyFormStore((state) => state.market);

	return (
		<WalletTokenProvider
			tokenAddress={(storeMarket || market)?.asset.address_}
			decimals={(storeMarket || market)?.asset.decimals}>
			<SupplyFormContent />
		</WalletTokenProvider>
	);
}

/**
 * The actual content of the supply form that uses the store
 */
function SupplyFormContent() {
	// Get handlers from the hook
	const {
		handleSupply,
		market,
		closeDrawer,
		getButtonText,
		isButtonDisabled,
		validateAmount,
		amount,
		walletBalance,
	} = useSupplyForm();

	// Validate amount and get error message if any
	const { valid: isAmountValid, error: validationError } = useMemo(() => {
		return validateAmount();
	}, [validateAmount]);

	// If token is not set, don't render anything
	if (!market) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Supply</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<SupplyFormInputs />
					<Card className='flex flex-col gap-3 p-6 bg-card-bold'>
						<SupplyTokenInfoCard />
						<Separator />
						<SupplyFormAPR />
						<Separator />
						<SupplyFormPriceBreakdownCard />
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				{amount && !isAmountValid && (
					<div className='mb-2 py-2 px-3 bg-red-50 border border-red-200 rounded-md'>
						<p className='text-sm text-red-600'>
							{validationError}
							{validationError === 'Insufficient balance' && (
								<span className='block text-xs mt-1'>
									Available: {walletBalance}{' '}
									{market.asset.symbol}
								</span>
							)}
						</p>
					</div>
				)}
				<ConnectedBtn.Primary
					onClick={handleSupply}
					disabled={
						isButtonDisabled() || (amount !== '' && !isAmountValid)
					}
					showConnectButton
					parentWidth>
					{getButtonText()}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default SupplyForm;
