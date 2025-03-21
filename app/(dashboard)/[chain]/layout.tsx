import React from 'react';
import { notFound } from 'next/navigation';
import { SUPPORTED_CHAINS } from '@/constant/config';
import { SupportedChain } from '@/store/useWeb3.store';
import { DappUserProvider } from '@/context/user-data.context';
import { TransactionStatusListener } from '@/components/transaction/transaction-status-listener';

async function layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ chain: string }>;
}) {
	const validChains = SUPPORTED_CHAINS;
	const { chain } = await params;

	if (!validChains.includes(chain.toLowerCase() as SupportedChain)) {
		notFound();
	}

	return (
		<DappUserProvider>
			<TransactionStatusListener />
			{children}
		</DappUserProvider>
	);
}

export default layout;
