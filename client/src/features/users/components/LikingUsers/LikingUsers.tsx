import UserList from '../UserList';
import userKeys from '../../queryKeys';
import { useLikingUsersQuery } from '../../hooks/useUsersQuery';

interface LikingUsersProps {
  chirpId: string;
}

const LikingUsers = ({ chirpId }: LikingUsersProps) => {
  return (
    <section>
      <UserList
        queryKeys={userKeys.list('liking', chirpId)}
        queryData={useLikingUsersQuery(chirpId)}
      />
    </section>
  );
};

export default LikingUsers;
