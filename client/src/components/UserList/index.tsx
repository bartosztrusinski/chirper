import User from '../User';
import { User as IUser } from '../../interfaces/User';
import useFollowedUsernames from '../../hooks/useFollowedUsernames';
import { forwardRef } from 'react';
import Loader from '../Loader';

interface UserListProps {
  users: IUser[];
  queryKeys: unknown[];
  page: number;
  onFollow: (username: string, page: number) => void;
  onUnfollow: (username: string, page: number) => void;
}

type LastUserRef = HTMLDivElement | null;

const UserList = forwardRef<LastUserRef, UserListProps>(function UserList(
  { users, queryKeys, page, onFollow, onUnfollow },
  ref,
) {
  const {
    data: followedUsernames,
    isError,
    isSuccess,
    isInitialLoading,
  } = useFollowedUsernames(
    [...queryKeys, `${page}`],
    users.map((user) => user._id),
  );

  const isUserFollowed = (username: string) =>
    isSuccess && followedUsernames.includes(username);

  const handleFollow = (username: string, page: number) => {
    if (isUserFollowed(username)) {
      onUnfollow(username, page);
    } else {
      onFollow(username, page);
    }
  };

  if (isInitialLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Oops something went wrong</div>;
  }

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
            onFollow={() => handleFollow(user.username, page)}
          />
        );
      })}
    </>
  );
});

export default UserList;
