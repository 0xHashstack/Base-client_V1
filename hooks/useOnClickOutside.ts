import { RefObject, useEffect } from 'react';

/**
 * Hook that handles click outside of the passed ref
 * @param ref - React ref object to detect clicks outside of
 * @param handler - Callback function to be called when a click outside is detected
 * @param exceptionalRefs - Array of refs to exclude from outside click detection
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  exceptionalRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      
      // Do nothing if clicking exceptional refs' elements or descendent elements
      for (const exceptionalRef of exceptionalRefs) {
        if (exceptionalRef.current && exceptionalRef.current.contains(target)) {
          return;
        }
      }
      
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, exceptionalRefs]);
}
