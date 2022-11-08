import { useQuery } from '@tanstack/react-query';
import UserService from '../../api/services/User';
import User from '../User';

interface Props {
  id: string;
}

const UserList = ({ id }: Props) => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(['users', 'liking', id], () => UserService.getManyLiking(id));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>
        Error:
        {error instanceof Error
          ? error.message
          : 'Oops, something went wrong...'}
      </p>
    );
  }

  return (
    <>
      {users.data.map((user) => {
        return <User key={user._id} user={user} />;
      })}
    </>
  );
};

export default UserList;
