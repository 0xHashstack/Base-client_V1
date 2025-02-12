import React from 'react';
import { notFound } from 'next/navigation';
import { SUPPORTED_CHAINS } from '@/constant/config';
import { SupportedChain } from '@/store/useWeb3.store';

function layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { chain: string };
}) {
	const validChains = SUPPORTED_CHAINS;

	if (!validChains.includes(params.chain.toLowerCase() as SupportedChain)) {
		notFound();
	}

	return children;
}

export default layout;
