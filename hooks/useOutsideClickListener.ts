import { useEffect, useRef } from 'react';

type Handler = () => void;

export const useOutsideClickListener = (handler: Handler) => {
	// Make the ref type more generic to accept any HTML element
	const ref = useRef<HTMLElement | null>(null);

	useEffect(() => {
		// Skip if no handler is provided
		if (!handler) return;

		const abortController = new AbortController();
		const { signal } = abortController;

		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			// Check if click target is actually a Node
			const target = event.target as Node | null;

			if (!target) return;

			// More precise check for ref.current existence
			if (ref.current && !ref.current.contains(target)) {
				handler();
			}
		};

		// Add both mousedown and touchstart for better mobile support
		document.addEventListener('mousedown', handleClickOutside, { signal });
		document.addEventListener('touchstart', handleClickOutside, { signal });

		return () => {
			abortController.abort();
		};
	}, [handler]); // Keep handler in dependencies

	return ref;
};
