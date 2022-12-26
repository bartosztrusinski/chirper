import { MakeGenerics, useSearch } from '@tanstack/react-location';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import ChirpService from '../../api/services/Chirp';
import useUser from '../../hooks/useUser';
import Chirp from '../Chirp';
import Loader from '../Loader';

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
  const { user: currentUser } = useUser();
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
    async ({ pageParam }) => {
      const { data, ...rest } = await ChirpService.searchChirps(
        searchParams as SearchParams,
        pageParam,
      );

      if (!currentUser || data.length === 0) {
        return { data, ...rest };
      }

      const likedChirpIds = await ChirpService.getLikedChirpIds(
        currentUser.username,
        data.map((chirp) => chirp._id),
      );

      return {
        data: data.map((chirp) => ({
          ...chirp,
          isLiked: likedChirpIds.includes(chirp._id),
        })),
        ...rest,
      };
    },
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

  const chirps = data.pages.reduce(
    (chirps: Chirp[], page) => [...chirps, ...page.data],
    [],
  );

  return (
    <section>
      <h1 className='visually-hidden'>Search timeline</h1>
      {chirps.map((chirp, index) => (
        <Chirp
          key={chirp._id}
          ref={index === chirps.length - 1 ? lastChirpRef : null}
          chirp={chirp}
          queryKeys={queryKeys}
        />
      ))}
      {isFetchingNextPage && <Loader />}
    </section>
  );
};

export default Search;
