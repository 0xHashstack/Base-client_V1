import { useEarnContext } from '../context/earn.context';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';

/**
 * Hook to handle earn table functionality
 * @returns Earn table state and handlers
 */
function useEarnTable() {
	const { tokens, tokenBalances } = useEarnContext();
	const { formatted, isLoading, isError } = tokenBalances;

	// Use the earn drawer context instead of local state
	const { isOpen: isEarnModalOpen, openDrawer: setIsEarnModalOpen } =
		useEarnDrawer();

	return {
		tokens,
		formatted,
		isLoading,
		isError,
		isEarnModalOpen,
		setIsEarnModalOpen,
	};
}

export default useEarnTable;
