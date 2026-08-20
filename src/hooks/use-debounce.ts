import { useEffect, useState } from "react";

/**
 * Returns `value` only once it has stopped changing for `delay` ms.
 *
 * Used to keep the expensive part of the list — filtering, grouping and
 * totalling — off the critical path while the user is still typing. The input
 * itself stays bound to the raw value so typing never feels laggy.
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
