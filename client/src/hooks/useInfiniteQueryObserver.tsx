import { Ref, useCallback, useRef } from 'react';
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';

type UseInfiniteQueryObserverProps = (
  isFetchingNextPage: boolean,
  hasNextPage: boolean | undefined,
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult>,
) => Ref<HTMLDivElement>;

const useInfiniteQueryObserver: UseInfiniteQueryObserverProps = (
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
) => {
  const intersectionObserver = useRef<IntersectionObserver>();

  const ref: Ref<HTMLDivElement> = useCallback(
    (element: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }

      intersectionObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (element) {
        intersectionObserver.current.observe(element);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return ref;
};

export default useInfiniteQueryObserver;
