import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value changes (e.g. search inputs).
 * @param {any} value - Value to debounce.
 * @param {number} delay - Debounce duration in milliseconds.
 * @returns {any} Debounced value.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
