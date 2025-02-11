import { create } from 'zustand';

interface LayoutState {
	isSidebarOpen: boolean;
	toggleSidebar: (val?: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()((set, get) => ({
	isSidebarOpen: false,
	toggleSidebar: (val?: boolean) =>
		set({ isSidebarOpen: val ?? !get().isSidebarOpen }),
}));
