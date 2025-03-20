/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography/Text';
import { BASE_SEPOLIA_TOKENS } from '@/constant/web3/token.constant';
import { HstkToken } from '@/types/web3/token.types';
import Image from 'next/image';
import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ConnectedBtn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Web3Address } from '@/types/web3';

function FaucetView() {
	const { isConnected } = useAccount();
	// Track which tokens are being minted
	const [mintingTokens, setMintingTokens] = useState<Record<string, boolean>>(
		{
			// Initialize with all tokens set to false (not minting)
			...BASE_SEPOLIA_TOKENS.reduce(
				(acc, token) => ({ ...acc, [token.address]: false }),
				{}
			),
		}
	);

	// Function to handle minting tokens
	const handleMint = async (token: HstkToken) => {
		if (!isConnected) return;

		// Set the token as minting
		setMintingTokens((prev) => ({ ...prev, [token.address]: true }));

		try {
			// This is where you would call the actual faucet contract
			// For now, we'll just simulate a delay and success
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Show success toast
			toast.success(
				`${token.symbol} tokens have been minted to your wallet.`
			);
		} catch (err) {
			// Show error toast
			toast.error(`Failed to mint ${token.symbol}. Please try again.`);
		} finally {
			// Set the token as not minting
			setMintingTokens((prev) => ({ ...prev, [token.address]: false }));
		}
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<Text.Medium20>Testnet Faucet</Text.Medium20>
				<Text.Regular14 textColor={500}>
					Get testnet tokens to use in the HashStack DeFi application.
				</Text.Regular14>
			</div>

			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead>Token</TableHead>
						<TableHead>Balance</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{BASE_SEPOLIA_TOKENS.map((token) => (
						<TokenRow
							key={token.address}
							token={token}
							isMinting={mintingTokens[token.address]}
							onMint={() => handleMint(token)}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

interface TokenRowProps {
	token: HstkToken;
	isMinting: boolean;
	onMint: () => void;
}

function TokenRow({ token, isMinting, onMint }: TokenRowProps) {
	const { data, isLoading } = useBalance({
		address: token.address as Web3Address,
	});

	return (
		<TableRow>
			<TableCell>
				<div className='flex items-center gap-3'>
					<div className='relative h-8 w-8 overflow-hidden rounded-full'>
						<Image
							src={token.iconUrl}
							alt={token.symbol}
							fill
							className='object-cover'
						/>
					</div>
					<div className='flex flex-col'>
						<Text.Medium14>{token.symbol}</Text.Medium14>
						<Text.Regular12 textColor={500}>
							{token.name}
						</Text.Regular12>
					</div>
				</div>
			</TableCell>
			<TableCell>
				{isLoading ?
					<Text.Regular14>Loading...</Text.Regular14>
				:	<Text.Regular14>{data?.formatted}</Text.Regular14>}
			</TableCell>
			<TableCell className='text-right'>
				<ConnectedBtn.Primary
					size={'default'}
					onClick={onMint}
					disabled={isMinting}>
					{isMinting ? 'Minting...' : 'Mint'}
				</ConnectedBtn.Primary>
			</TableCell>
		</TableRow>
	);
}

export default FaucetView;
