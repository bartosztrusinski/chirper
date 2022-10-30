import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import useMediaQuery from './useMediaQuery';

const useDarkMode = (initialValue = false) => {
  const prefersDarkMode = usePrefersDarkMode();

  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    'dark-mode',
    initialValue || prefersDarkMode,
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light',
    );
  }, [isDarkMode]);

  return {
    toggleDarkMode: () => setIsDarkMode((prev) => !prev),
    turnOnDarkMode: () => setIsDarkMode(true),
    turnOffDarkMode: () => setIsDarkMode(false),
    isDarkMode,
  } as const;
};

const usePrefersDarkMode = () => {
  return useMediaQuery('(prefers-color-scheme: dark');
};

export default useDarkMode;
