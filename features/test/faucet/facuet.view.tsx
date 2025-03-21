'use client';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography/Text';
import { BASE_SEPOLIA_TOKEN_ADDRESS_LIST } from '@/constant/web3/token.constant';
import React, { useEffect } from 'react';
import { useAccount, useConfig, useWriteContract } from 'wagmi';
import { ConnectedBtn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableLoader,
	TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Web3Address } from '@/types/web3';
import { FaucetToken, useFaucetStore } from '@/store/useFaucetStore';
import TokenUtil from '@/lib/config/token';
import erc20ABI from '@abi/erc_20.abi.json';

function FaucetView() {
	const config = useConfig();

	// Get token data and minting state from the store
	const { tokens, tokensLoading, setTokens, setTokensLoading } =
		useFaucetStore();

	// Fetch token data when component mounts
	useEffect(() => {
		const fetchTokenData = async () => {
			setTokensLoading(true);
			try {
				const tokenUtil = new TokenUtil(config);
				// Fetch all token data in parallel using the utility class
				const tokenData = await tokenUtil.getMultipleTokenNames(
					BASE_SEPOLIA_TOKEN_ADDRESS_LIST as Web3Address[]
				);

				// Update the store with the fetched token data
				setTokens(tokenData);
			} catch (error) {
				console.error('Failed to fetch token data:', error);
				toast.error(
					'Failed to fetch token data. Please refresh the page.'
				);
			} finally {
				setTokensLoading(false);
			}
		};

		fetchTokenData();
	}, [setTokens, setTokensLoading, config]);

	return (
		<Card className='p-6'>
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<Text.Medium20>Testnet Faucet</Text.Medium20>
					<Text.Regular14 textColor={500}>
						Get testnet tokens to use in the HashStack DeFi
						application.
					</Text.Regular14>
				</div>

				<Table isPrimary>
					<TableHeader>
						<TableRow>
							<TableHead>Token</TableHead>
							<TableHead className='text-right'>
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					{tokensLoading ?
						<TableLoader
							rowCount={4}
							colCount={3}
						/>
					:	<TableBody>
							{tokens.map((token) => (
								<TokenRow
									key={token.address}
									token={token}
								/>
							))}
						</TableBody>
					}
				</Table>
			</div>
		</Card>
	);
}

interface TokenRowProps {
	token: FaucetToken;
}

function TokenRow({ token }: TokenRowProps) {
	const { address } = useAccount();
	const { writeContractAsync, isPending } = useWriteContract();
	const { setMintingToken, mintingTokens } = useFaucetStore();
	const isMinting = mintingTokens[token.address];

	// Handle minting tokens using the contract's requestTokens method
	const handleMintClick = async () => {
		try {
			// Call the contract's requestTokens method
			setMintingToken(token.address, true);

			await writeContractAsync({
				address: token.address as `0x${string}`,
				abi: erc20ABI,
				functionName: 'requestTokens',
				account: address,
			});

			// Call the parent's onMint callback to update the UI
			toast.success(
				`${token.name} tokens have been minted to your wallet.`
			);
		} catch (error) {
			console.error('Error calling requestTokens:', error);
			toast.error(`Failed to mint ${token.name}. Please try again.`);
		} finally {
			setMintingToken(token.address, false);
		}
	};

	return (
		<TableRow>
			<TableCell>
				<div className='flex items-center gap-3'>
					<div className='flex flex-col'>
						<Text.Regular12>{token.name}</Text.Regular12>
					</div>
				</div>
			</TableCell>
			<TableCell className='text-right'>
				<ConnectedBtn.Primary
					size='default'
					onClick={handleMintClick}
					disabled={isMinting || isPending}>
					{isMinting || isPending ? 'Minting...' : 'Mint'}
				</ConnectedBtn.Primary>
			</TableCell>
		</TableRow>
	);
}

export default FaucetView;
