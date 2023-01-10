import UserService from '../../api/services/User';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import Loader from '../Loader';
import ConfirmModal from '../ConfirmModal';
import useFollowUser from '../../hooks/useFollowUser';
import useUser from '../../hooks/useUser';
import User from '../User';
import Container from '../Container';
import Heading from '../Heading';
import MutedText from '../MutedText';
import Button from '../Button';

interface UsersResponse {
  data: User[];
  meta?: {
    nextPage?: string;
  };
}

interface UserListProps {
  queryKeys: unknown[];
  queryFn: (sinceId?: string) => Promise<UsersResponse>;
}

const UserList = ({ queryKeys, queryFn }: UserListProps) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  const { followUser, unfollowUser } = useFollowUser(queryKeys);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['users', ...queryKeys],
      async ({ pageParam }) => {
        const { data, ...rest } = await queryFn(pageParam);

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

  if (data) {
    const users = data.pages.flatMap((page) => page.data);

    if (users.length === 0) {
      return (
        <Container>
          <Heading size='small'>No users found 👀</Heading>
          <MutedText>Sorry! You are the only user here</MutedText>
        </Container>
      );
    }

    return (
      <>
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
        {hasNextPage ? (
          <div style={{ minHeight: '2.5rem' }}>
            {isFetchingNextPage && <Loader />}
          </div>
        ) : (
          <Container>
            <Heading size='small'>🚧 End of the road 🚧</Heading>
            <MutedText>
              You&apos;ve reached the end! No more people here
            </MutedText>
          </Container>
        )}

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
      </>
    );
  }

  if (isError) {
    return (
      <Container>
        <Heading size='small'>
          Oops... looks like we couldn&apos;t get users 😬
        </Heading>
        <MutedText>
          Try clicking the button below or refreshing the page
        </MutedText>
        <Button
          style={{ marginTop: '0.75rem' }}
          onClick={() =>
            queryClient.refetchQueries(['users', ...queryKeys], { exact: true })
          }
        >
          Retry
        </Button>
      </Container>
    );
  }

  return <Loader />;
};

export default UserList;
