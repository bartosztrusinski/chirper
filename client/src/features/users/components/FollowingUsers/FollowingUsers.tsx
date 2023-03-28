import UserList from '../UserList';
import userKeys from '../../queryKeys';
import { useFollowingUsersQuery } from '../../hooks/useUsersQuery';

interface FollowingUsersProps {
  username: string;
}

const FollowingUsers = ({ username }: FollowingUsersProps) => {
  return (
    <section>
      <UserList
        queryKeys={userKeys.list('following', username)}
        queryData={useFollowingUsersQuery(username)}
      />
    </section>
  );
};

export default FollowingUsers;
