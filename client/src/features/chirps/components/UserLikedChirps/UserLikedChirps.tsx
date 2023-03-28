import ChirpList from '../ChirpList';
import { useUserLikedChirpsQuery } from '../../hooks/useChirpsQuery';
import chirpKeys from '../../queryKeys';

interface UserLikedChirpsProps {
  username: string;
}

const UserLikedChirps = ({ username }: UserLikedChirpsProps) => {
  return (
    <section>
      <h1 className='visually-hidden'>{`${username}'s liked Chirps`}</h1>
      <ChirpList
        queryKeys={chirpKeys.list('liked', username)}
        queryData={useUserLikedChirpsQuery(username)}
      />
    </section>
  );
};

export default UserLikedChirps;
