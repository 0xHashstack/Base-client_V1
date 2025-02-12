import React from 'react';
import { notFound } from 'next/navigation';
import { SUPPORTED_CHAINS } from '@/constant/config';
import { SupportedChain } from '@/store/useWeb3.store';

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

	return children;
}

export default layout;
