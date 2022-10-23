import { useQuery } from '@tanstack/react-query';
import ChirpService from '../../api/services/Chirp';
import Chirp from '../Chirp';

function ChirpList() {
  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery<{ data: Chirp[] }, Error>(['chirps'], () =>
    ChirpService.getMany(),
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      {chirps.data.map((chirp) => {
        return (
          <>
            <Chirp chirp={chirp} />
          </>
        );
      })}
    </>
  );
}

export default ChirpList;
