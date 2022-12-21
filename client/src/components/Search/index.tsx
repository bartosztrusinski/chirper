import { MakeGenerics, useSearch } from '@tanstack/react-location';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import ChirpService from '../../api/services/Chirp';
import useUser from '../../hooks/useUser';
import AuthenticatedChirpList from '../AuthenticatedChirpList';
import Loader from '../Loader';
import UnauthenticatedChirpList from '../UnauthenticatedChirpList';

type SearchParams = {
  query: string;
  sortOrder?: 'relevant' | 'recent' | 'popular';
  from?: string;
  includeReplies?: boolean;
  followedOnly?: boolean;
  startTime?: string;
  endTime?: string;
};

type LocationGenerics = MakeGenerics<{
  Search: SearchParams & { dialog?: 'advanced-search' };
}>;

const Search = () => {
  const { user } = useUser();
  const search = useSearch<LocationGenerics>();

  const searchParams = {
    query: search.query,
    sortOrder: search.sortOrder,
    from: search.from,
    includeReplies: search.includeReplies,
    followedOnly: search.followedOnly,
    startTime: search.startTime,
    endTime: search.endTime,
  };

  const queryKeys = ['search', searchParams];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['chirps', ...queryKeys],
    ({ pageParam }) =>
      ChirpService.searchChirps(searchParams as SearchParams, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.meta?.nextPage,
      enabled: Boolean(searchParams.query),
    },
  );

  const intersectionObserver = useRef<IntersectionObserver>();

  const lastChirpRef = useCallback(
    (chirp: HTMLElement | null) => {
      if (isFetchingNextPage) return;

      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }

      intersectionObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (chirp) {
        intersectionObserver.current.observe(chirp);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  if (!data) {
    return <div>Search for something</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      {data.pages.map((page, index) => {
        const isLastPage = index === data.pages.length - 1;

        return user ? (
          <AuthenticatedChirpList
            ref={isLastPage ? lastChirpRef : null}
            key={index}
            chirps={page.data}
            queryKeys={queryKeys}
            page={index}
          />
        ) : (
          <UnauthenticatedChirpList
            ref={isLastPage ? lastChirpRef : null}
            key={index}
            chirps={page.data}
          />
        );
      })}
      {isFetchingNextPage && <Loader />}
    </>
  );
};

export default Search;
