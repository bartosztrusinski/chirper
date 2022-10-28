import { useEffect, useState, Dispatch, SetStateAction } from 'react';

type SetState<T> = Dispatch<SetStateAction<T>>;

const useLocalStorage = <T,>(
  key: string,
  initialValue?: T,
): readonly [T, SetState<T>] => {
  const [storedValue, setStoredValue] = useState<T>(function readValue() {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(
    function persistValue() {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”: ${error}`);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setStoredValue] as const;
};

export default useLocalStorage;
