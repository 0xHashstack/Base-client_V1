import NotFoundBase from '@/components/404/not-found.component';
import { Web3Address } from '@/types/web3';
import React from 'react';

function page({ params }: { params: { market: Web3Address } }) {
	const { market } = params;
	if (!market.startsWith('0x')) {
		return <NotFoundBase />;
	}
	return <div>{market}</div>;
}

export default page;
