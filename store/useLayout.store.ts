import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
	isSidebarOpen: boolean;
	toggleSidebar: (val?: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
	persist(
		(set, get) => ({
			isSidebarOpen: false,
			toggleSidebar: (val?: boolean) =>
				set({ isSidebarOpen: val ?? !get().isSidebarOpen }),
		}),
		{
			name: 'hstk-layout-storage',
		}
	)
);
