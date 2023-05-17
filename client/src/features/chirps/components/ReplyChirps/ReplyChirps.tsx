import ChirpList from '../ChirpList';
import { useReplyChirpsQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';
import { ChirpLocationGenerics } from '../../interface';
import { useMatch } from '@tanstack/react-location';

const ReplyChirps = () => {
  const {
    params: { id },
  } = useMatch<ChirpLocationGenerics>();

  return (
    <section>
      <ChirpList
        queryKeys={chirpKeys.list('replies', id)}
        queryData={useReplyChirpsQuery(id)}
      />
    </section>
  );
};

export default ReplyChirps;
