import Container from '../../components/ui/Container';
import Line from '../../components/ui/Line';
import { CreateChirpForm, FeedChirps } from '../../features/chirps';
import { useCurrentUser } from '../../features/users';
import { Navigate } from '@tanstack/react-location';
import { useEffect } from 'react';

const Home = () => {
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    document.title = 'Home';
  }, []);

  if (!currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <>
      <Container>
        <CreateChirpForm />
      </Container>

      <Line />

      <FeedChirps username={currentUser.username} />
    </>
  );
};

export default Home;
