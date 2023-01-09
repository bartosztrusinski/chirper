import ChirpService from '../../api/services/Chirp';
import ChirpList from '../ChirpList';
import { useMatch } from '@tanstack/react-location';

const UserLikedChirps = () => {
  const {
    params: { username },
  } = useMatch();
  const queryKeys = [username, 'liked'];

  return (
    <section>
      <h1 className='visually-hidden'>{`${username}'s liked Chirps`}</h1>
      <ChirpList
        queryKeys={queryKeys}
        queryFn={(sinceId?: string) =>
          ChirpService.getManyLikedByUser(username, sinceId)
        }
      />
    </section>
  );
};

export default UserLikedChirps;
