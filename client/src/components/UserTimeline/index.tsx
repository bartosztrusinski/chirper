import AuthenticatedChirpList from '../AuthenticatedChirpList';
import ChirpService from '../../api/services/Chirp';
import { useQuery } from '@tanstack/react-query';
import useUser from '../../hooks/useUser';
import { StoredUser } from '../../interfaces/User';

const UserTimeline = () => {
  const { user } = useUser() as { user: StoredUser };
  const queryKeys = [user.username, 'timeline'];

  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps', ...queryKeys], () =>
    ChirpService.getUserTimeline(user.username),
  );

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

  return <AuthenticatedChirpList chirps={chirps} queryKeys={queryKeys} />;
};

export default UserTimeline;
