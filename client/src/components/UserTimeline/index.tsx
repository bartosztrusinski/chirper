import ChirpService from '../../api/services/Chirp';
import { useInfiniteQuery } from '@tanstack/react-query';
import useUser from '../../hooks/useUser';
import { StoredUser } from '../../interfaces/User';
import { useCallback, useRef } from 'react';
import Loader from '../Loader';
import Chirp from '../Chirp';

const UserTimeline = () => {
  const { user: currentUser } = useUser() as { user: StoredUser };
  const queryKeys = [currentUser.username, 'timeline'];

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
      const { data, ...rest } = await ChirpService.getUserTimeline(
        currentUser.username,
        pageParam,
      );

      if (data.length === 0) {
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
    { getNextPageParam: (lastPage) => lastPage.meta?.nextPage },
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

  const chirps = data.pages.flatMap((page) => page.data);

  return (
    <section>
      <h1 className='visually-hidden'>Your Home Timeline</h1>
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

export default UserTimeline;
