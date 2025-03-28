import { Web3Address } from '@/types/web3';

export const LOCAL_ROUTE = {
	EARN: {
		HOME: '/earn',
		MARKET: (market: Web3Address) => `/earn/${market}`,
	},
	BORROW: {
		HOME: '/borrow',
	},
	MIGRATE: {
		HOME: '/migrate',
	},
	FAUCET: '/faucet',
	PROTOCOL: {
		INSIGHTS: '/protocol/insights',
	},
	USER: {
		INSIGHTS: '/user/insights',
	},
};

export const EXTERNAL_ROUTE = {
	FEEDBACK: '',
	TAC: '',
};
