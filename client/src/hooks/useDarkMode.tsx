import useLocalStorage from './useLocalStorage';
import useMediaQuery from './useMediaQuery';

const useDarkMode = (defaultValue = false) => {
  const prefersDarkMode = usePrefersDarkMode();

  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    'dark-mode',
    defaultValue || prefersDarkMode,
  );

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
