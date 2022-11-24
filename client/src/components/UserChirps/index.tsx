import ChirpList from '../ChirpList';
import ChirpService from '../../api/services/Chirp';
import { useQuery } from '@tanstack/react-query';
import { useMatch } from '@tanstack/react-location';

interface UserChirpsProps {
  withReplies?: boolean;
}

const UserChirps = ({ withReplies = false }: UserChirpsProps) => {
  const {
    params: { username },
  } = useMatch();
  const queryKeys = [username, withReplies ? 'withReplies' : 'noReplies'];

  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps', ...queryKeys], () =>
    ChirpService.getManyByUser(username, withReplies),
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

  return <ChirpList chirps={chirps} queryKeys={queryKeys} />;
};

export default UserChirps;
