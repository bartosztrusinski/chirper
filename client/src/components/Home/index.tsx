import { Navigate } from '@tanstack/react-location';
import { useEffect } from 'react';
import useUser from '../../hooks/useUser';
import CreateChirpForm from '../CreateChirpForm';
import UserTimeline from '../UserTimeline';

const Home = () => {
  const { user } = useUser();

  useEffect(() => {
    document.title = 'Home';
  }, []);

  if (!user) {
    return <Navigate to='/' />;
  }

  return (
    <>
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <CreateChirpForm />
      </div>
      <UserTimeline />
    </>
  );
};

export default Home;
