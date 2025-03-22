'use client';

import { useWatchAsset } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet } from '@phosphor-icons/react';
import { useEffect } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface AddTokenToWalletProps {
	address: string;
	symbol: string;
	decimals: number;
	name: string;
	iconUrl?: string;
	className?: string;
	customIcon?: React.ReactNode;
}

function AddTokenToWallet({
	address,
	symbol,
	decimals,
	iconUrl,
	className,
	customIcon,
}: AddTokenToWalletProps) {
	const { watchAsset, isPending, isSuccess, isError, error } =
		useWatchAsset();

	const handleAddToken = async () => {
		watchAsset({
			type: 'ERC20',
			options: {
				address,
				symbol,
				decimals,
				image: iconUrl,
			},
		});
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success('Token added to wallet');
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError) {
			toast.error('Failed to add token to wallet');
			console.error(error);
		}
	}, [isError]);

	return (
		<TooltipProvider>
			<Tooltip delayDuration={400}>
				<TooltipTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						onClick={handleAddToken}
						disabled={isPending}
						className={className}>
						{customIcon ?? <Wallet size={16} />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add token to wallet</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default AddTokenToWallet;
