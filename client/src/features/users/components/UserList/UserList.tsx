import User from '../User';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import Container from '../../../../components/ui/Container';
import Heading from '../../../../components/ui/Heading';
import MutedText from '../../../../components/ui/MutedText';
import Loader from '../../../../components/ui/Loader';
import Button from '../../../../components/ui/Button';
import useFollowUser from '../../hooks/useFollowUser';
import useInfiniteQueryObserver from '../../../../hooks/useInfiniteQueryObserver';
import { UseInfiniteQueryResult, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UsersResponse } from '../../interface';
import { toast } from 'react-hot-toast';

interface UserListProps {
  queryKeys: readonly unknown[];
  queryData: UseInfiniteQueryResult<UsersResponse>;
}

const UserList = ({ queryKeys, queryData }: UserListProps) => {
  const queryClient = useQueryClient();
  const { followUser, unfollowUser } = useFollowUser(queryKeys);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    queryData;
  const lastUserRef = useInfiniteQueryObserver(
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
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
                followUser(user.username, {
                  onError: () => toast.error('Failed to follow user'),
                });
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
            unfollowUser(selectedUsername, {
              onError: () => toast.error('Failed to unfollow user'),
            });
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
          onClick={() => queryClient.refetchQueries(queryKeys, { exact: true })}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return <Loader />;
};

export default UserList;
