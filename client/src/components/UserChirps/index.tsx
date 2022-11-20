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

  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(
    ['chirps', username, withReplies ? 'withReplies' : 'noReplies'],
    () => ChirpService.getManyByUser(username, withReplies),
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

  return <ChirpList chirps={chirps.data} />;
};

export default UserChirps;
