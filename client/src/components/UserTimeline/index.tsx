import AuthenticatedChirpList from '../AuthenticatedChirpList';
import ChirpService from '../../api/services/Chirp';
import { useInfiniteQuery } from '@tanstack/react-query';
import useUser from '../../hooks/useUser';
import { StoredUser } from '../../interfaces/User';
import { useCallback, useRef } from 'react';
import Loader from '../Loader';

const UserTimeline = () => {
  const { user } = useUser() as { user: StoredUser };
  const queryKeys = [user.username, 'timeline'];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['chirps', ...queryKeys],
    ({ pageParam }) => ChirpService.getUserTimeline(user.username, pageParam),
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
      <h1 className='visually-hidden'>Your Home Timeline</h1>
      {data.pages.map((page, index) => {
        const isLastPage = index === data.pages.length - 1;

        return (
          <AuthenticatedChirpList
            ref={isLastPage ? lastChirpRef : null}
            key={index}
            chirps={page.data}
            queryKeys={queryKeys}
            page={index}
          />
        );
      })}
      {isFetchingNextPage && <Loader />}
    </section>
  );
};

export default UserTimeline;
