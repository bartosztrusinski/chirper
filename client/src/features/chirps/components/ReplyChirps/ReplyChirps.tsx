import ChirpList from '../ChirpList';
import { useReplyChirpsQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';

interface ReplyChirpsProps {
  chirpId: string;
}

const ReplyChirps = ({ chirpId }: ReplyChirpsProps) => {
  return (
    <section>
      <ChirpList
        queryKeys={chirpKeys.list('replies', chirpId)}
        queryData={useReplyChirpsQuery(chirpId)}
      />
    </section>
  );
};

export default ReplyChirps;
