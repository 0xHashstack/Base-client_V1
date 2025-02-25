import { StatCard } from '@/components/ui/card/stat-card';
import React from 'react';

function MyPositionQuickStat() {
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Total Positions'
				value='$567.876'
			/>

			<StatCard
				title='Total APR'
				value='3.476%'
				valueClassName='text-success'
			/>
		</div>
	);
}

export default MyPositionQuickStat;
