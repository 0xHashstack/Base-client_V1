import React from 'react';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { cn } from '@/lib/utils';

interface TableLoaderProps {
	rowCount?: number;
	colCount?: number;
	className?: string;
}

/**
 * Component to display a loading state for tables
 */
const TableLoader: React.FC<TableLoaderProps> = ({
	rowCount = 3,
	colCount = 4,
	className,
}) => {
	// Create an array of the specified row count
	const rows = Array.from({ length: rowCount }, (_, i) => i);
	// Create an array of the specified column count
	const cols = Array.from({ length: colCount }, (_, i) => i);

	return (
		<>
			{rows.map((row) => (
				<tr
					key={`loader-row-${row}`}
					className={cn('w-full', className)}>
					{cols.map((col) => (
						<td
							key={`loader-col-${row}-${col}`}
							className='p-2'>
							<Skeleton className='h-8 w-full rounded' />
						</td>
					))}
				</tr>
			))}
		</>
	);
};

export default TableLoader;
