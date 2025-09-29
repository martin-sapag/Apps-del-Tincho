
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Fix: Changed React.Dispatch<React.SetStateAction<T>> to Dispatch<SetStateAction<T>> and updated import
export function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
     try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
     } catch (error) {
       console.error(error);
       setStoredValue(initialValue)
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [storedValue, setValue];
}