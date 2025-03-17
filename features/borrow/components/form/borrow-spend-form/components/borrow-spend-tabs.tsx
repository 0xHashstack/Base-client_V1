'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography/Text';
import { useBorrowSpendForm } from '../../../../hooks/useBorrowSpendForm';
import { cn } from '@/lib/utils';
import { HstkToken } from '@/types/web3/token.types';

/**
 * Component for the borrow spend tabs (Liquidity Provisioning and Swap)
 */
export default function BorrowSpendTabs() {
	const { activeTab, handleTabChange, market } = useBorrowSpendForm();

	return (
		<Card className='flex flex-col gap-4 px-6 py-4'>
			{/* Tab Headers */}
			<div className='flex border-b'>
				<button
					className={cn(
						'px-4 py-2 text-sm font-medium',
						activeTab === 'liquidity'
							? 'border-b-2 border-primary-500 text-primary-500'
							: 'text-gray-500 hover:text-gray-700'
					)}
					onClick={() => handleTabChange('liquidity')}>
					Liquidity Provisioning
				</button>
				<button
					className={cn(
						'px-4 py-2 text-sm font-medium',
						activeTab === 'swap'
							? 'border-b-2 border-primary-500 text-primary-500'
							: 'text-gray-500 hover:text-gray-700'
					)}
					onClick={() => handleTabChange('swap')}>
					Swap
				</button>
			</div>

			{/* Tab Content */}
			<div className='flex flex-col gap-4'>
				{activeTab === 'liquidity' ? (
					<LiquidityProvisioningTab market={market} />
				) : (
					<SwapTab />
				)}
			</div>
		</Card>
	);
}

/**
 * Liquidity Provisioning Tab Content
 */
function LiquidityProvisioningTab({ market }: { market: HstkToken | null }) {
	return (
		<div className='flex flex-col gap-4'>
			<Text.Medium16>Liquidity Provisioning</Text.Medium16>
			
			{market ? (
				<>
					<div className='flex justify-between'>
						<Text.Regular14 className='text-gray-500'>Market</Text.Regular14>
						<Text.Medium14>{market.symbol}</Text.Medium14>
					</div>
					<div className='flex justify-between'>
						<Text.Regular14 className='text-gray-500'>Fees</Text.Regular14>
						<Text.Medium14>0.3%</Text.Medium14>
					</div>
					<div className='flex justify-between'>
						<Text.Regular14 className='text-gray-500'>APR</Text.Regular14>
						<Text.Medium14>5.2%</Text.Medium14>
					</div>
					<div className='flex justify-between'>
						<Text.Regular14 className='text-gray-500'>Total Liquidity</Text.Regular14>
						<Text.Medium14>$1,245,678</Text.Medium14>
					</div>
				</>
			) : (
				<Text.Regular14 className='text-gray-500'>
					Select a market to view liquidity provisioning details
				</Text.Regular14>
			)}
		</div>
	);
}

/**
 * Swap Tab Content
 */
function SwapTab() {
	return (
		<div className='flex flex-col items-center justify-center py-8 gap-4'>
			<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
				<Text.Medium24>🔄</Text.Medium24>
			</div>
			<Text.Medium16>Swap Feature</Text.Medium16>
			<Text.Regular14 className='text-gray-500 text-center'>
				This feature will be available soon. Stay tuned for updates!
			</Text.Regular14>
		</div>
	);
}
