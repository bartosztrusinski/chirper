import ChirpList from '../ChirpList';
import { useFeedChirpsQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';

interface FeedChirpsProps {
  username: string;
}

const FeedChirps = ({ username }: FeedChirpsProps) => {
  return (
    <section>
      <h1 className='visually-hidden'>Your Home Timeline</h1>
      <ChirpList
        queryKeys={chirpKeys.list('feed', username)}
        queryData={useFeedChirpsQuery(username)}
      />
    </section>
  );
};

export default FeedChirps;
