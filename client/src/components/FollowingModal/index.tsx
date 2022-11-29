import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

interface FollowingModalProps extends ReactModal.Props {
  username: string;
}

const FollowingModal = ({
  username,
  isOpen,
  onRequestClose,
}: FollowingModalProps) => {
  const queryKeys = [username, 'following'];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['users', ...queryKeys],
    ({ pageParam }) => UserService.getManyFollowing(username, pageParam),
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  return (
    <Modal title='Following' isOpen={isOpen} onRequestClose={onRequestClose}>
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
    </Modal>
  );
};

export default FollowingModal;
