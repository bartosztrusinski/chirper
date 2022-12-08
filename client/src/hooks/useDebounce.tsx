import { useEffect, useState } from 'react';

const useDebounce = <T,>(value: T, delayMs: number) => {
  const [debounce, setDebounce] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(value);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounce;
};

export default useDebounce;
