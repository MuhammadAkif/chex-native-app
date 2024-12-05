import {useState, useEffect} from 'react';

/**
 * Custom hook to debounce a function.
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - A debounced version of the callback.
 */
const useDebounce = (callback, delay) => {
  const [debouncedFn, setDebouncedFn] = useState(() => callback);

  useEffect(() => {
    // Create a debounced version of the callback function using setTimeout
    const debounced = (...args) => {
      clearTimeout(debouncedFn.timeout);
      debouncedFn.timeout = setTimeout(() => {
        callback(...args);
      }, delay);
    };

    setDebouncedFn(() => debounced);

    return () => {
      // Cleanup on unmount or when the callback or delay changes
      clearTimeout(debouncedFn.timeout);
    };
  }, [callback, delay]);

  return debouncedFn;
};

export default useDebounce;
