import ChirpService from '../../api/services/Chirp';
import useUser from '../../hooks/useUser';
import AuthenticatedChirpList from '../AuthenticatedChirpList';
import UnauthenticatedChirpList from '../UnauthenticatedChirpList';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import Loader from '../Loader';

const Explore = () => {
  const queryKeys = ['explore'];
  const { user } = useUser();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['chirps', ...queryKeys],
    ({ pageParam }) => ChirpService.getMany(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.meta?.nextPage,
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  return (
    <section>
      <h1 className='visually-hidden'>Explore</h1>
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
    </section>
  );
};

export default Explore;
