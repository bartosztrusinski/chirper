import User from '../User';
import { StoredUser, User as IUser } from '../../interfaces/User';
import useFollowedUsernames from '../../hooks/useFollowedUsernames';
import useUser from '../../hooks/useUser';
import useFollowUser from '../../hooks/useFollowUser';
import ConfirmModal from '../ConfirmModal';
import { forwardRef, useState } from 'react';

interface UserListProps {
  users: IUser[];
  queryKeys: unknown[];
  page: number;
}

type LastUserRef = HTMLDivElement | null;

const UserList = forwardRef<LastUserRef, UserListProps>(function UserList(
  { users, queryKeys, page },
  ref,
) {
  const { user: currentUser } = useUser() as { user: StoredUser };
  const { followUser, unfollowUser } = useFollowUser(queryKeys, page);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const {
    data: followedUsernames,
    isError,
    isLoading,
    isSuccess,
  } = useFollowedUsernames(
    [...queryKeys, `${page}`],
    currentUser.username,
    users.map((user) => user._id),
  );

  // if (isLoading && users.length) {
  //   return <div>Loading...</div>;
  // }

  if (isError) {
    return <div>Oops something went wrong</div>;
  }

  const isUserFollowed = (username: string) =>
    isSuccess && followedUsernames.includes(username);

  const handleFollow = (username: string) => {
    if (isUserFollowed(username)) {
      setSelectedUsername(username);
      setIsConfirmModalOpen(true);
    } else {
      followUser(username);
    }
  };

  return (
    <>
      {users.map((user, index) => {
        const isLastUser = index === users.length - 1;

        return (
          <User
            ref={isLastUser ? ref : null}
            key={user._id}
            user={user}
            isFollowed={isUserFollowed(user.username)}
            isFollowEnabled={!isLoading}
            onFollow={handleFollow}
          />
        );
      })}
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
});

export default UserList;
