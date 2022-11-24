import ChirpList from '../ChirpList';
import ChirpService from '../../api/services/Chirp';
import { useQuery } from '@tanstack/react-query';
import { useMatch } from '@tanstack/react-location';

const UserLikedChirps = () => {
  const {
    params: { username },
  } = useMatch();
  const queryKeys = [username, 'liked'];

  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps', ...queryKeys], () =>
    ChirpService.getManyLikedByUser(username),
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

export default UserLikedChirps;
