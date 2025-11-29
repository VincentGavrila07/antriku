import { useState, useEffect } from "react";

/**
 * Hook untuk debounce sebuah value
 * @param value value yang ingin didebounce
 * @param delay delay dalam milidetik
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
