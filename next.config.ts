import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 's2.coinmarketcap.com',
			},
			{
				hostname: 'cloudflare-ipfs.com',
			},
			{
				hostname: 'tokens.example.com',
			},
		],
	},
};

export default nextConfig;
