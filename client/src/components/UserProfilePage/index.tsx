import useUser from '../../hooks/useUser';
import AuthenticatedProfilePage from './AuthenticatedProfilePage';
import UnauthenticatedProfilePage from './UnauthenticatedProfilePage';

const UserProfilePage = () => {
  const { user } = useUser();
  return user ? <AuthenticatedProfilePage /> : <UnauthenticatedProfilePage />;
};

export default UserProfilePage;
