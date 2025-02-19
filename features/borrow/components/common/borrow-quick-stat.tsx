import { StatCard } from '@/components/ui/card/stat-card';

function BorrowQuickStat() {
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Market Deposit'
				value='$97689.32'
			/>
			<StatCard
				title='Market APR'
				value='3.476%'
			/>
		</div>
	);
}

export default BorrowQuickStat;
