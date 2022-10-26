import { useQuery } from '@tanstack/react-query';
import ChirpService from '../../api/services/Chirp';
import Chirp from '../Chirp';

function ChirpList() {
  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps'], () => ChirpService.getMany());

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
      {chirps.data.map((chirp) => {
        return <Chirp key={chirp._id} chirp={chirp} />;
      })}
    </>
  );
}

export default ChirpList;
