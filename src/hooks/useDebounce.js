import {useEffect, useRef} from 'react';

/**
 * Custom hook to debounce a function.
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - A debounced version of the callback.
 */
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup the timeout on unmount or when the callback or delay changes
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [callback, delay]);

  const debouncedFn = (...args) => {
    clearTimeout(timeoutRef.current); // Clear any existing timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args); // Call the debounced function after the delay
    }, delay);
  };

  return debouncedFn;
};

export default useDebounce;
