import { cn } from '@/lib/utils';
import { Text } from '../typography/Text';
import { Skeleton } from '../skeleton/skeleton';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	value: string | number;
	titleClassName?: string;
	valueClassName?: string;
	isLoading?: boolean;
}

export function StatCard({
	isLoading = false,
	title,
	value,
	className,
	titleClassName,
	valueClassName,
	...props
}: StatCardProps) {
	return (
		<div
			className={cn(
				'flex items-center gap-3 rounded-md py-3 px-4 bg-card-secondary border border-quick-stat',
				className
			)}
			{...props}>
			<Text.Regular12
				textColor={600}
				className={titleClassName}>
				{title}
			</Text.Regular12>
			{isLoading ?
				<Skeleton className='h-4 w-20 rounded-md' />
			:	<Text.Semibold12 className={valueClassName}>
					{value}
				</Text.Semibold12>
			}
		</div>
	);
}
