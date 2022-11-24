import { useQuery } from '@tanstack/react-query';
import ChirpService from '../../api/services/Chirp';
import IChirp from '../../interfaces/Chirp';
import ChirpList from '../ChirpList';

interface ChirpRepliesProps {
  chirp: IChirp;
}

const ChirpReplies = ({ chirp }: ChirpRepliesProps) => {
  const queryKeys = [chirp._id, 'replies'];

  const {
    data: replies,
    isLoading,
    isError,
  } = useQuery(['chirps', ...queryKeys], () =>
    ChirpService.getMany(chirp.replies),
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: Oops, something went wrong...</p>;
  }

  return <ChirpList chirps={replies} queryKeys={queryKeys} />;
};

export default ChirpReplies;
