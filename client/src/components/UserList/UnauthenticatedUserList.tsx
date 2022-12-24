import User from '../User';
import { User as IUser } from '../../interfaces/User';
import { forwardRef } from 'react';

interface UserListProps {
  users: IUser[];
}

type LastUserRef = HTMLDivElement | null;

const UnauthenticatedUserList = forwardRef<LastUserRef, UserListProps>(
  function UnauthenticatedUserList({ users }, ref) {
    return (
      <>
        {users.map((user, index) => {
          const isLastUser = index === users.length - 1;

          return (
            <User ref={isLastUser ? ref : null} key={user._id} user={user} />
          );
        })}
      </>
    );
  },
);

export default UnauthenticatedUserList;
