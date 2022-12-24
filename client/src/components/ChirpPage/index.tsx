import useUser from '../../hooks/useUser';
import AuthenticatedChirpPage from './AuthenticatedChirpPage';
import UnauthenticatedChirpPage from './UnauthenticatedChirpPage';

const ChirpPage = () => {
  const { user } = useUser();
  return user ? <AuthenticatedChirpPage /> : <UnauthenticatedChirpPage />;
};

export default ChirpPage;
