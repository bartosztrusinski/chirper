import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import Loader from '../Loader';

interface FollowedModalProps extends ReactModal.Props {
  username: string;
}

const FollowedModal = ({ username, ...restProps }: FollowedModalProps) => {
  const queryKeys = [username, 'followed'];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['users', ...queryKeys],
    ({ pageParam }) => UserService.getManyFollowed(username, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.meta?.nextPage,
    },
  );

  const intersectionObserver = useRef<IntersectionObserver>();

  const lastUserRef = useCallback(
    (user: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }

      intersectionObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (user) {
        intersectionObserver.current.observe(user);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <Modal title='Followed' {...restProps}>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div>Oops something went wrong...</div>
      ) : (
        <>
          {data.pages.map((page, index) => {
            const isLastPage = index === data.pages.length - 1;

            return (
              <UserList
                ref={isLastPage ? lastUserRef : null}
                key={index}
                users={page.data}
                queryKeys={queryKeys}
                page={index}
              />
            );
          })}
          {isFetchingNextPage && <Loader />}
        </>
      )}
    </Modal>
  );
};

export default FollowedModal;
