import { StatCard } from '@/components/ui/card/stat-card';

function BorrowQuickStat() {
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Total Debt'
				value='$10,000'
			/>
			<StatCard
				title='Available to Borrow'
				value='$50,000'
			/>
			<StatCard
				title='Health Factor'
				value='1.5'
			/>
		</div>
	);
}

export default BorrowQuickStat;
