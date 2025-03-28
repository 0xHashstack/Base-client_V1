import React from 'react';
import { Text } from '../typography/Text';
import { Skeleton } from '../skeleton/skeleton';

function ChartHeading({
	title,
	value,
	isLoading,
}: {
	title: string;
	value: string;
	isLoading?: boolean;
}) {
	return (
		<div className='flex flex-col'>
			<Text.Medium14 textColor={500}>{title}</Text.Medium14>
			{isLoading ?
				<Skeleton className='h-6 mt-1 w-40 rounded-md' />
			:	<Text.Semibold20>{value}</Text.Semibold20>}
		</div>
	);
}

export default ChartHeading;
