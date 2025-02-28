'use client';
import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table/index';
import { Btn } from '@/components/ui/button';
import { Text } from '@/components/ui/typography/Text';
import { HoverPopover } from '@/components/ui/popover/hover-popover';
import { TokenInfo } from '@/components/web3/token/token-info';
import EarnQuickStat from '../common/earn-quick-stat';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import AddTokenToWallet from '@/components/actions/cta/add-token-to-wallet';
import useEarnTable from '../../hooks/useEarnTable';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import SupplyForm from '../form/suppy-form';
import { HstkToken } from '@/types/web3';

function EarnTable() {
	const { formatted, tokens } = useEarnTable();
	const { openDrawer, setDrawerContent } = useEarnDrawer();

	// Handle opening the supply drawer
	const handleSupplyClick = (token: HstkToken) => {
		// Set the drawer content to the supply form
		setDrawerContent(<SupplyForm token={token} />);
		// Open the drawer
		openDrawer();
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Earn Markets</Text.Medium20>
				<EarnQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead>Market</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Wallet balance</TableHead>
						<TableHead>Total Supply</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => (
						<TableRow key={token.address}>
							<TableCell className='font-medium'>
								<div className='flex items-center gap-3'>
									<ImageWithLoader
										src={token.iconUrl}
										alt={token.name}
										width={20}
										height={20}
									/>
									{token.name}
									<AddTokenToWallet
										className='bg-background w-6 h-6 rounded-full'
										address={token.address}
										symbol={token.symbol}
										decimals={token.decimals}
										name={token.name}
									/>
								</div>
							</TableCell>
							<TableCell>{token.name}</TableCell>
							<TableCell>
								<HoverPopover
									side='bottom'
									content={
										<TokenInfo
											name={token.name}
											address={token.address}
										/>
									}
									contentClassName='w-80 p-3'>
									<span>
										{formatted?.[token.address] || '-'}
									</span>
								</HoverPopover>
							</TableCell>
							<TableCell>{token.name}</TableCell>
							<TableCell className='w-[100px]'>
								<Btn.Primary
									onClick={() => handleSupplyClick(token)}>
									Supply
								</Btn.Primary>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/* The SideDrawer is now managed by the EarnDrawerProvider */}
		</div>
	);
}

export default EarnTable;
