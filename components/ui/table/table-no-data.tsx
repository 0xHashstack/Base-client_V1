import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import { Empty } from '@phosphor-icons/react';

interface TableNoDataProps {
	message?: string;
	className?: string;
	colSpan?: number;
}

/**
 * Component to display when a table has no data
 */
const TableNoData: React.FC<TableNoDataProps> = ({
	message = 'No data available',
	className,
	colSpan = 4,
}) => {
	return (
		<tr className={cn('w-full', className)}>
			<td
				colSpan={colSpan}
				className='py-10'>
				<div className='flex flex-col items-center justify-center gap-2 text-center'>
					<div className='rounded-full bg-muted p-3 text-primary-600'>
						<Empty size={36} />
					</div>
					<Text.Medium16 textColor={500}>{message}</Text.Medium16>
				</div>
			</td>
		</tr>
	);
};

export default TableNoData;
