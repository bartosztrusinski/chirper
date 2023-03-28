import UserList from '../UserList';
import userKeys from '../../queryKeys';
import { useFollowedUsersQuery } from '../../hooks/useUsersQuery';

interface FollowedUsersProps {
  username: string;
}

const FollowedUsers = ({ username }: FollowedUsersProps) => {
  return (
    <section>
      <UserList
        queryKeys={userKeys.list('followed', username)}
        queryData={useFollowedUsersQuery(username)}
      />
    </section>
  );
};

export default FollowedUsers;
