'use client';
import { useWeb3Store } from '@/store/useWeb3.store';
import { useTransitionRouter } from 'next-view-transitions';
import { usePathname, useSearchParams } from 'next/navigation';

function useCustomRouter() {
	const router = useTransitionRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const selectedChain = useWeb3Store((state) => state.selectedChain);

	const dashboardRouter = {
		push: (href: string, options?: Parameters<typeof router.push>[1]) => {
			if (!href.startsWith('/')) {
				href = `/${href}`;
			}
			return router.push(`/${selectedChain}${href}`, options);
		},
	};

	return {
		router,
		pathName,
		searchParams,
		dashboardRouter,
	};
}

export default useCustomRouter;
