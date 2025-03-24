import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: [
			's2.coinmarketcap.com',
			'cloudflare-ipfs.com',
			'tokens.example.com',
		],
	},
};

export default nextConfig;
