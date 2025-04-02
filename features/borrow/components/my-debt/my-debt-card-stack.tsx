import React, { useMemo } from 'react';
import MyDebtCard from './my-debt-card';
import BorrowQuickStat from '../common/borrow-quick-stat';
import { useTokenStore } from '@/store/useTokenStore';
import { LoanUsageStatus } from '@/types/web3/borrow-market.types';
import If from '@/components/common/If';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { Text } from '@/components/ui/typography/Text';

function MyDebtCardStack() {
	// Using selector pattern for Zustand stores as per project preference
	const userAllLoans = useTokenStore((state) => state.userAllLoans);
	const isLoadingBorrowMarket = useTokenStore(
		(state) => state.isLoadingBorrowMarket
	);

	// Filter active loans based on status
	const activeLoans = useMemo(() => {
		if (!userAllLoans || userAllLoans.length === 0) return [];

		// Filter loans with active status
		return userAllLoans.filter((loan) =>
			[LoanUsageStatus.ACTIVE, LoanUsageStatus.SPENT].includes(
				Number(loan.usageDetails.status)
			)
		);
	}, [userAllLoans]);

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>My Debt Positions</Text.Medium20>
				<BorrowQuickStat />
			</div>
			
			<If isTrue={isLoadingBorrowMarket}>
				<div className='flex flex-col gap-4'>
					{[...Array(3)].map((_, index) => (
						<Skeleton
							className='h-48 w-full'
							key={`shimmer-${index}`}
						/>
					))}
				</div>
			</If>

			{!isLoadingBorrowMarket && activeLoans.length === 0 && (
				<div className='text-center py-4'>No debt positions found</div>
			)}

			{!isLoadingBorrowMarket &&
				activeLoans.map((loan) => (
					<MyDebtCard
						key={`${loan.borrowedAsset.address_}-${loan.usageDetails.status}`}
						loanPosition={loan}
					/>
				))}
		</div>
	);
}

export default MyDebtCardStack;
