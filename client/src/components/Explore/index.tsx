import { useQuery } from '@tanstack/react-query';
import ChirpList from '../ChirpList';
import ChirpService from '../../api/services/Chirp';

const Explore = () => {
  const {
    data: chirps,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps', 'explore'], () => ChirpService.getMany());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        {error instanceof Error
          ? error.message
          : 'Oops something went wrong...'}
      </div>
    );
  }

  return (
    <>
      <ChirpList chirps={chirps.data} />
    </>
  );
};

export default Explore;
