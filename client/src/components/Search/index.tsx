import { MakeGenerics, useNavigate, useSearch } from '@tanstack/react-location';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChirpService from '../../api/services/Chirp';
import useUser from '../../hooks/useUser';
import AuthenticatedChirpList from '../AuthenticatedChirpList';
import SearchFilterModal from '../SearchFilterModal';
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
  const navigate = useNavigate<LocationGenerics>();

  const searchParams = {
    query: search.query,
    sortOrder: search.sortOrder,
    from: search.from,
    includeReplies: search.includeReplies,
    followedOnly: search.followedOnly,
    startTime: search.startTime,
    endTime: search.endTime,
  };

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState<boolean>(
    search.dialog === 'advanced-search',
  );

  useEffect(() => {
    setIsAdvancedSearchOpen(search.dialog === 'advanced-search');
  }, [search.dialog]);

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
    return <div>Loading...</div>;
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

      <SearchFilterModal
        isOpen={isAdvancedSearchOpen}
        onRequestClose={() =>
          navigate({ search: (old) => ({ ...old, dialog: undefined }) })
        }
      />
    </>
  );
};

export default Search;
