import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';

interface TokenInfoProps {
	name: string;
	address: string;
	className?: string;
}

export function TokenInfo({ name, address, className }: TokenInfoProps) {
	return (
		<div className={cn('flex flex-col gap-1 w-[180px]', className)}>
			<div className='flex items-center gap-2'>
				<Text.Regular12 textColor={600}>Name</Text.Regular12>
				<Text.Regular12>{name}</Text.Regular12>
			</div>
			<div className='flex items-center gap-2'>
				<Text.Regular12 textColor={600}>Address</Text.Regular12>
				<Text.Regular12 className='break-all'>{address}</Text.Regular12>
			</div>
		</div>
	);
}
