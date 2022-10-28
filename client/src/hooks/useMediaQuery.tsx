import { useEffect, useState } from 'react';

const useMediaQuery = (mediaQuery: string) => {
  const [matches, setMatches] = useState<boolean>(function getMatches() {
    return matchMedia(mediaQuery).matches;
  });

  useEffect(
    function listenForChanges() {
      const mediaQueryList = matchMedia(mediaQuery);

      setMatches(mediaQueryList.matches);

      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      mediaQueryList.addEventListener('change', handleChange);

      return () => {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    },
    [mediaQuery],
  );

  return matches;
};

export default useMediaQuery;
