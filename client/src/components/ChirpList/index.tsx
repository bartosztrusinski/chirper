import useUser from '../../hooks/useUser';
import IChirp from '../../interfaces/Chirp';
import AuthenticatedChirpList from '../AuthenticatedChirpList';
import UnauthenticatedChirpList from '../UnauthenticatedChirpList';

interface ChirpListProps {
  chirps: IChirp[];
  queryKeys: string[];
}

const ChirpList = ({ chirps, queryKeys }: ChirpListProps) => {
  const { user } = useUser();

  return user ? (
    <AuthenticatedChirpList chirps={chirps} queryKeys={queryKeys} />
  ) : (
    <UnauthenticatedChirpList chirps={chirps} />
  );
};

export default ChirpList;
