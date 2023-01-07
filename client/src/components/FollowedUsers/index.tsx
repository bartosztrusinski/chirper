import UserService from '../../api/services/User';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import Loader from '../Loader';
import ConfirmModal from '../ConfirmModal';
import useFollowUser from '../../hooks/useFollowUser';
import useUser from '../../hooks/useUser';
import User from '../User';

interface FollowedUsersProps {
  username: string;
}

const FollowedUsers = ({ username }: FollowedUsersProps) => {
  const queryKeys = [username, 'followed'];
  const { user: currentUser } = useUser();
  const { followUser, unfollowUser } = useFollowUser(queryKeys);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['users', ...queryKeys],
    async ({ pageParam }) => {
      const { data, ...rest } = await UserService.getManyFollowed(
        username,
        pageParam,
      );

      if (!currentUser || data.length === 0) {
        return { data, ...rest };
      }

      const followedUsernames = await UserService.getFollowedUsernames(
        currentUser.username,
        data.map((user) => user._id),
      );

      return {
        data: data.map((user) => ({
          ...user,
          isFollowed: followedUsernames.includes(user.username),
        })),
        ...rest,
      };
    },
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  const users = data.pages.flatMap((page) => page.data);

  return (
    <section>
      {users.map((user, index) => (
        <User
          key={user._id}
          ref={index === users.length - 1 ? lastUserRef : null}
          user={user}
          onFollow={() => {
            if (user.isFollowed) {
              setSelectedUsername(user.username);
              setIsConfirmModalOpen(true);
            } else {
              followUser(user.username);
            }
          }}
        />
      ))}
      {isFetchingNextPage && <Loader />}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        heading={`Unfollow @${selectedUsername}?`}
        description='Their Chirps will no longer show up in your home timeline. You can still view their profile.'
        confirmText='Unfollow'
        onConfirm={() => {
          unfollowUser(selectedUsername);
          setIsConfirmModalOpen(false);
        }}
      />
    </section>
  );
};

export default FollowedUsers;
