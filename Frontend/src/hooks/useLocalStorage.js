import { useCallback, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const val = value instanceof Function ? value(stored) : value;
      setStored(val);
      localStorage.setItem(key, JSON.stringify(val));
    },
    [key, stored]
  );

  const removeValue = useCallback(() => {
    setStored(initialValue);
    localStorage.removeItem(key);
  }, [key, initialValue]);

  return [stored, setValue, removeValue];
}
