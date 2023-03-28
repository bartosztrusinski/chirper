import ChirpList from '../ChirpList';
import { useUserChirpsWithRepliesQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';

interface UserChirpsWithRepliesProps {
  username: string;
}

const UserChirpsWithReplies = ({ username }: UserChirpsWithRepliesProps) => {
  return (
    <section>
      <h1 className='visually-hidden'>{`${username}'s Chirps`}</h1>
      <ChirpList
        queryKeys={chirpKeys.list('withReplies', username)}
        queryData={useUserChirpsWithRepliesQuery(username)}
      />
    </section>
  );
};

export default UserChirpsWithReplies;
