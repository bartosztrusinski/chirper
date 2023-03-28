import ChirpList from '../ChirpList';
import { useUserChirpsQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';

interface UserChirpsProps {
  username: string;
}

const UserChirps = ({ username }: UserChirpsProps) => {
  return (
    <section>
      <h1 className='visually-hidden'>{`${username}'s Chirps`}</h1>
      <ChirpList
        queryKeys={chirpKeys.list('noReplies', username)}
        queryData={useUserChirpsQuery(username)}
      />
    </section>
  );
};

export default UserChirps;
