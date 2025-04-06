'use client';
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/typography/Text';
import { Select } from '@/components/ui/select';
import SlidingTab from '@/components/ui/tabs/sliding-tab';
import { useL3DappStore } from '@/store/useL3DappStore';
import { L3Dapp, L3DappPool } from '@/types/web3/dapp.types';
import { Barricade } from '@phosphor-icons/react';
import {
	useBorrowSpendFormStore,
	BorrowSpendFormState,
} from '../../../../store/borrow-spend-form.store';
import GasFeeText from '@/components/utility/GasFeeText';

/**
 * Component for the borrow spend tabs (Liquidity Provisioning and Swap)
 */
export default function BorrowSpendTabs() {
	const { activeTab, setActiveTab } = useBorrowSpendFormStore(
		(state) => state
	);

	return (
		<>
			{/* Tab Headers */}
			<SlidingTab
				tabs={[
					{ id: 'liquidity', label: 'Liquidity provisioning' },
					{ id: 'swap', label: 'Swap' },
				]}
				activeTab={activeTab}
				onChange={setActiveTab}
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
	// Use the store values instead of local state
	const selectedDapp = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.selectedDapp
	);
	const selectedPool = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.selectedPool
	);
	const setSelectedDapp = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.setSelectedDapp
	);
	const setSelectedPool = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.setSelectedPool
	);

	// Render functions for dapp select
	const renderDappOption = (option: L3Dapp, isSelected: boolean) => {
		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
				<Image
					src={option.logoURI}
					alt={option.name}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Regular14>{option.name}</Text.Regular14>
			</div>
		);
	};

	const renderSelectedDapp = (option: L3Dapp | null) => {
		if (!option) return 'Select Dapp';
		return (
			<div className='flex items-start gap-2'>
				<Image
					src={option.logoURI}
					alt={option.name}
					className='rounded-full'
					width={18}
					height={18}
				/>
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
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
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
					valueKey='symbol'
					labelKey='name'
					onChange={(_, option) => setSelectedDapp(option)}
					renderOption={renderDappOption}
					renderValue={renderSelectedDapp}
					className='border-none p-0 shadow-none ring-0'
					dropdownClassName='select-primary-displacement'
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
					onChange={(_, option) => setSelectedPool(option)}
					renderOption={renderPoolOption}
					renderValue={renderSelectedPool}
					className='border-none p-0 shadow-none ring-0'
					disabled={!selectedDapp}
					dropdownClassName='select-primary-displacement'
				/>
			</Card>

			{/* Fee Breakdown Card */}

			<Card className='p-4 bg-card-bold'>
				<div className='flex flex-col gap-3'>
					<div className='flex items-center justify-between'>
						<Text.Regular12>Network Fee</Text.Regular12>
						<GasFeeText />
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
		<Card className='flex flex-col bg-card-bold p-4 border-none'>
			<div className='flex gap-3 items-center'>
				<div className='w-11 h-11 bg-card rounded-md border border-card flex items-center justify-center'>
					<Barricade size={28} />
				</div>
				<div className='flex-1 flex flex-col gap-1'>
					<Text.Semibold14>It will be live soon!</Text.Semibold14>
					<Text.Regular12>
						This feature is currently under development.
					</Text.Regular12>
				</div>
			</div>
		</Card>
	);
}
