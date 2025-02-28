import { useEffect } from 'react';

/**
 * Hook to handle Escape key press
 * @param callback Function to call when Escape key is pressed
 * @param active Whether the hook should be active
 */
export function useEscapeKey(callback: () => void, active: boolean = true) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    if (active) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [callback, active]);
}
