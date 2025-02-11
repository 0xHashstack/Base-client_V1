'use client';
import If from '@/components/common/If';
import { Btn } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import React from 'react';

type Chain = {
	hasIcon: boolean;
	iconUrl?: string;
	iconBackground?: string;
	id: number;
	name?: string;
	unsupported?: boolean;
};

type Account = {
	address: string;
	balanceDecimals?: number;
	balanceFormatted?: string;
	balanceSymbol?: string;
	displayBalance?: string;
	displayName: string;
	ensAvatar?: string;
	ensName?: string;
	hasPendingTransactions: boolean;
};

function Web3ConnectButton() {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				mounted,
			}) => {
				const connected = !!(mounted && account && chain);

				return (
					<div
						aria-hidden={!mounted}
						className={cn({
							'pointer-events-none opacity-0 select-none':
								!mounted,
						})}>
						<If isTrue={connected}>
							<ConnectedActionArea
								openAccountModal={openAccountModal}
								openChainModal={openChainModal}
								chain={chain!}
								account={account!}
							/>

							<If isTrue={chain?.unsupported}>
								<WrongNetworkButton onClick={openChainModal} />
								<ConnectWalletButton
									onClick={openConnectModal}
								/>
							</If>
						</If>
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}

const ConnectedActionArea = ({
	openAccountModal,
	chain,
	account,
}: {
	openAccountModal: () => void;
	openChainModal: () => void;
	chain: Chain;
	account: Account;
}) => {
	return (
		<TooltipProvider>
			<div
				className='flex bg-background h-8 items-center justify-center cursor-pointer rounded-md  px-2 gap-2'
				onClick={openAccountModal}>
				<If isTrue={chain.hasIcon && chain.iconUrl}>
					<Image
						className='flex-shrink-0'
						src={chain.iconUrl!}
						alt={chain.name!}
						width={20}
						height={20}
					/>
				</If>
				<Text.Regular13>{account.displayName}</Text.Regular13>
			</div>
		</TooltipProvider>
	);
};

const WrongNetworkButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Btn.Destructive
			className='pointer-events-none'
			onClick={onClick}>
			Wrong Network
		</Btn.Destructive>
	);
};

const ConnectWalletButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Btn.Primary
			onClick={onClick}
			className='h-10 bg-button-wallet text-button-wallet-text hover:bg-button-wallet/80'>
			Connect Wallet
		</Btn.Primary>
	);
};

export default Web3ConnectButton;
