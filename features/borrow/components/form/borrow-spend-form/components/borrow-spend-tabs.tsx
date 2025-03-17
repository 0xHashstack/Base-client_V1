'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography/Text';
import { Select } from '@/components/ui/select';
import { useBorrowSpendForm } from '../../../../hooks/useBorrowSpendForm';
import SlidingTab from '@/components/ui/tabs/sliding-tab';

import { useL3DappStore } from '@/store/useL3DappStore';
import { L3Dapp, L3DappPool } from '@/types/web3/dapp.types';

/**
 * Component for the borrow spend tabs (Liquidity Provisioning and Swap)
 */
export default function BorrowSpendTabs() {
	const { activeTab, handleTabChange } = useBorrowSpendForm();

	return (
		<>
			{/* Tab Headers */}
			<SlidingTab
				tabs={[
					{ id: 'liquidity', label: 'Liquidity provisioning' },
					{ id: 'swap', label: 'Swap' },
				]}
				activeTab={activeTab}
				onChange={handleTabChange}
			/>

			{/* Tab Content */}
			<div className='flex flex-col gap-4'>
				{activeTab === 'liquidity' ?
					<LiquidityProvisioningTab />
				:	<SwapTab />}
			</div>
		</>
	);
}

/**
 * Liquidity Provisioning Tab Content
 */
function LiquidityProvisioningTab() {
	const { dapps } = useL3DappStore();
	const [selectedDapp, setSelectedDapp] = useState<L3Dapp | null>(null);
	const [selectedPool, setSelectedPool] = useState<L3DappPool | null>(null);

	// Render functions for dapp select
	const renderDappOption = (option: L3Dapp, isSelected: boolean) => {
		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}>
				<Text.Regular14>{option.name}</Text.Regular14>
			</div>
		);
	};

	const renderSelectedDapp = (option: L3Dapp | null) => {
		if (!option) return 'Select Dapp';
		return (
			<div className='flex items-start gap-2'>
				<div className='flex flex-col'>
					<Text.Medium14>{option.name}</Text.Medium14>
				</div>
			</div>
		);
	};

	// Render functions for pool select
	const renderPoolOption = (option: L3DappPool, isSelected: boolean) => {
		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}>
				<Text.Regular14>{option.name}</Text.Regular14>
			</div>
		);
	};

	const renderSelectedPool = (option: L3DappPool | null) => {
		if (!option) return 'Select Market';
		return (
			<div className='flex items-start gap-2'>
				<div className='flex flex-col'>
					<Text.Medium14>{option.name}</Text.Medium14>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col gap-4'>
			{/* Dapp Selection */}
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<Select.SingleSelect
					label='Select Dapp'
					options={dapps}
					value={selectedDapp}
					valueKey='key'
					labelKey='name'
					onChange={setSelectedDapp}
					renderOption={renderDappOption}
					renderValue={renderSelectedDapp}
					className='border-none p-0 shadow-none ring-0'
				/>
			</Card>

			{/* Pool Selection */}
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<Select.SingleSelect
					label='Select Pool'
					options={selectedDapp?.pools || []}
					value={selectedPool}
					valueKey='key'
					labelKey='name'
					onChange={setSelectedPool}
					renderOption={renderPoolOption}
					renderValue={renderSelectedPool}
					className='border-none p-0 shadow-none ring-0'
					disabled={!selectedDapp}
				/>
			</Card>

			{/* Fee Breakdown Card */}

			<Card className='p-4 bg-gray-50'>
				<div className='flex flex-col gap-3'>
					<div className='flex items-center justify-between'>
						<Text.Regular12>Fees</Text.Regular12>
						<Text.Regular12>0.3%</Text.Regular12>
					</div>
					<div className='flex items-center justify-between'>
						<Text.Regular12>APR</Text.Regular12>
						<Text.Regular12>5.2%</Text.Regular12>
					</div>
					<div className='flex items-center justify-between'>
						<Text.Regular12>Total Liquidity</Text.Regular12>
						<Text.Regular12>$1,245,678</Text.Regular12>
					</div>
				</div>
			</Card>
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
