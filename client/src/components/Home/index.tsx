import { Navigate } from '@tanstack/react-location';
import useUser from '../../hooks/useUser';
import ComposeChirpForm from '../ComposeChirpForm';
import UserTimeline from '../UserTimeline';

const Home = () => {
  const { user } = useUser();

  return user ? (
    <>
      <ComposeChirpForm />
      <div style={{ borderTop: '1px solid var(--border-color)' }}>
        <UserTimeline />
      </div>
    </>
  ) : (
    <Navigate to='/?login=true' />
  );
};

export default Home;
