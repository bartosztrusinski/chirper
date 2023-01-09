import ChirpService from '../../api/services/Chirp';
import ChirpList from '../ChirpList';
import { useMatch } from '@tanstack/react-location';

interface UserChirpsProps {
  withReplies?: boolean;
}

const UserChirps = ({ withReplies = false }: UserChirpsProps) => {
  const {
    params: { username },
  } = useMatch();
  const queryKeys = [username, withReplies ? 'withReplies' : 'noReplies'];

  return (
    <section>
      <h1 className='visually-hidden'>{`${username}'s Chirps`}</h1>
      <ChirpList
        queryKeys={queryKeys}
        queryFn={(sinceId?: string) =>
          ChirpService.getManyByUser(username, sinceId, withReplies)
        }
      />
    </section>
  );
};

export default UserChirps;
