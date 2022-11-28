import ChirpService from '../../api/services/Chirp';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMatch } from '@tanstack/react-location';
import { useCallback, useRef } from 'react';
import AuthenticatedChirpList from '../AuthenticatedChirpList';
import UnauthenticatedChirpList from '../UnauthenticatedChirpList';
import useUser from '../../hooks/useUser';

const UserLikedChirps = () => {
  const { user } = useUser();
  const {
    params: { username },
  } = useMatch();
  const queryKeys = [username, 'liked'];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['chirps', ...queryKeys], () =>
    ChirpService.getManyLikedByUser(username),
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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
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
    </>
  );
};

export default UserLikedChirps;
