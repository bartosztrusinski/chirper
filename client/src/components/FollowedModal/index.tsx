import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

interface FollowedModalProps extends ReactModal.Props {
  username: string;
}

const FollowedModal = ({
  username,
  isOpen,
  onRequestClose,
}: FollowedModalProps) => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  return (
    <Modal title='Followed' isOpen={isOpen} onRequestClose={onRequestClose}>
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

export default FollowedModal;
