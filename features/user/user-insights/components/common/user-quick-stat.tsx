import { StatCard } from '@/components/ui/card/stat-card';

interface UserQuickStatProps {
	marketDeposit: number;
	netApr: number;
	isLoading?: boolean;
}

function UserQuickStat({
	marketDeposit,
	netApr,
	isLoading = false,
}: UserQuickStatProps) {
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Market Deposit'
				value={`$${marketDeposit.toLocaleString()}`}
				isLoading={isLoading}
			/>
			<StatCard
				title='Net APR'
				value={`${netApr.toFixed(3)}%`}
				isLoading={isLoading}
			/>
		</div>
	);
}

export default UserQuickStat;
