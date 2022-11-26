import User from '../User';
import { StoredUser, User as IUser } from '../../interfaces/User';
import useFollowedUsernames from '../../hooks/useFollowedUsernames';
import useUser from '../../hooks/useUser';
import useFollowUser from '../../hooks/useFollowUser';
import ConfirmModal from '../ConfirmModal';
import { useState } from 'react';

interface UserListProps {
  users: IUser[];
  queryKeys: string[];
}

const UserList = ({ users, queryKeys }: UserListProps) => {
  const { user: currentUser } = useUser() as { user: StoredUser };
  const { followUser, unfollowUser } = useFollowUser(queryKeys);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const {
    data: followedUsernames,
    isError,
    isLoading,
  } = useFollowedUsernames(
    queryKeys,
    currentUser.username,
    users.map((user) => user._id),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong</div>;
  }

  if (!users.length) {
    return <p>No users found</p>;
  }

  const isUserFollowed = (username: string) =>
    followedUsernames.includes(username);

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
      {users.map((user) => (
        <User
          key={user._id}
          user={user}
          isFollowed={isUserFollowed(user.username)}
          onFollow={handleFollow}
        />
      ))}
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
};

export default UserList;
