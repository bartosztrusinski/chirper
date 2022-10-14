import useViewport from './useViewport';

function useMediaQuery(breakpoint: number, type: 'min' | 'max' = 'min') {
  const { width } = useViewport();
  return type === 'min' ? width > breakpoint : width < breakpoint;
}

export default useMediaQuery;
