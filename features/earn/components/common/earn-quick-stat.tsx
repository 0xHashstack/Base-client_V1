import { StatCard } from '@/components/ui/card';
import React from 'react';

function EarnQuickStat() {
	return (
		<div className='flex gap-2 justify-between tablet:justify-start tablet:gap-4 items-center flex-wrap'>
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
