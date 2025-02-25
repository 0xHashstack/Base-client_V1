import { StatCard } from '@/components/ui/card/stat-card';
import React from 'react';

function EarnQuickStat() {
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Market Deposit'
				value='$97689.32'
				className='min-w-[200px]'
			/>

			<StatCard
				title='Market APR'
				value='3.476%'
				valueClassName='text-success'
			/>
		</div>
	);
}

export default EarnQuickStat;
