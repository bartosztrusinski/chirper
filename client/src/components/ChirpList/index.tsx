import { useQuery } from '@tanstack/react-query';
import Chirp from '../../api/services/Chirp';

function ChirpList() {
  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery<{ _id: number }[]>(['chirps'], Chirp.getMany);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {chirps.map((chirp) => (
        <p key={chirp._id}>{chirp._id}</p>
      ))}
    </div>
  );
}

export default ChirpList;
