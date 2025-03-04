'use client';
import React, { useCallback } from 'react';
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
import { useEarnContext } from '../../context/earn.context';
import { useEarnDrawer } from '../../context/earn-drawer.context';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import MyPositionQuickStat from '../common/my-position-quick-stat';
import SupplyWithdrawForm from '../form/supply-withdraw-form';
import SupplyForm from '../form/supply-form';
import { HstkToken } from '@/types/web3';

function MyPositionsTable() {
	const { tokens, tokenBalances } = useEarnContext();
	const { formatted } = tokenBalances;
	const { openDrawer, setDrawerContent } = useEarnDrawer();

	/**
	 * Handle opening the supply form
	 */
	const handleOpenSupplyForm = useCallback(
		(token: HstkToken) => {
			setDrawerContent(<SupplyForm token={token} />);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	/**
	 * Handle opening the withdraw form
	 */
	const handleOpenWithdrawForm = useCallback(
		(token: HstkToken) => {
			setDrawerContent(<SupplyWithdrawForm token={token} />);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>My Positions</Text.Medium20>
				<MyPositionQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead>Market</TableHead>
						<TableHead>Value</TableHead>
						<TableHead>APR</TableHead>
						<TableHead>Actions</TableHead>
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
									}>
									<span>
										{formatted?.[token.address] || '-'}
									</span>
								</HoverPopover>
							</TableCell>
							<TableCell className='w-[200px]'>
								<div className='flex items-center gap-4'>
									<Btn.Outline
										onClick={() =>
											handleOpenSupplyForm(token)
										}>
										Add
									</Btn.Outline>
									<Btn.Secondary
										onClick={() =>
											handleOpenWithdrawForm(token)
										}>
										Withdraw
									</Btn.Secondary>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default MyPositionsTable;
