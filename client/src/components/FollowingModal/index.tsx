import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import Loader from '../Loader';
import useFollowUser from '../../hooks/useFollowUser';
import ConfirmModal from '../ConfirmModal';

interface FollowingModalProps extends ReactModal.Props {
  username: string;
}

const FollowingModal = ({ username, ...restProps }: FollowingModalProps) => {
  const queryKeys = [username, 'following'];

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const { followUser, unfollowUser } = useFollowUser(queryKeys);

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
    { getNextPageParam: (lastPage) => lastPage.meta?.nextPage },
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

  const handleFollowUser = (newFollowUsername: string, page: number) => {
    followUser({ newFollowUsername, page });
  };

  const handleUnfollowUser = (username: string, page: number) => {
    setSelectedUsername(username);
    setSelectedPage(page);
    setIsConfirmModalOpen(true);
  };

  return (
    <Modal title='Following' {...restProps}>
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
                onFollow={handleFollowUser}
                onUnfollow={handleUnfollowUser}
              />
            );
          })}
          {isFetchingNextPage && <Loader />}

          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onRequestClose={() => setIsConfirmModalOpen(false)}
            heading={`Unfollow @${selectedUsername}?`}
            description='Their Chirps will no longer show up in your home timeline. You can still view their profile.'
            confirmText='Unfollow'
            onConfirm={() => {
              unfollowUser({
                deletedFollowUsername: selectedUsername,
                page: selectedPage,
              });
              setIsConfirmModalOpen(false);
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default FollowingModal;
