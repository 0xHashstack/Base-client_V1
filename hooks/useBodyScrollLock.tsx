import { useEffect } from 'react';

/**
 * Hook to prevent body scrolling when a modal/drawer is open
 * @param isLocked Whether the body scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    // Prevent body scroll when locked
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
}
