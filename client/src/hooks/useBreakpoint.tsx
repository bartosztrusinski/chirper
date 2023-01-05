import useMediaQuery from './useMediaQuery';

const useBreakpoint = (
  direction: 'up' | 'down',
  breakpoint: 'small' | 'medium' | 'large' | 'xlarge',
) => {
  const breakpointValue = getComputedStyle(
    document.documentElement,
  ).getPropertyValue(`--breakpoint-${breakpoint}`);

  return useMediaQuery(
    `(${direction === 'up' ? 'min' : 'max'}-width: ${breakpointValue})`,
  );
};

export default useBreakpoint;
