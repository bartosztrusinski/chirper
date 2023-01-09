import { Navigate } from '@tanstack/react-location';
import { useEffect } from 'react';
import useUser from '../../hooks/useUser';
import ChirpList from '../ChirpList';
import CreateChirpForm from '../CreateChirpForm';
import ChirpService from '../../api/services/Chirp';
import Container from '../Container';
import Line from '../Line';

const Home = () => {
  const { user: currentUser } = useUser();

  useEffect(() => {
    document.title = 'Home';
  }, []);

  if (!currentUser) {
    return <Navigate to='/' />;
  }

  const queryKeys = [currentUser.username, 'timeline'];

  return (
    <>
      <Container>
        <CreateChirpForm />
      </Container>

      <Line />

      <section>
        <h1 className='visually-hidden'>Your Home Timeline</h1>
        <ChirpList
          queryKeys={queryKeys}
          queryFn={(sinceId?: string) =>
            ChirpService.getUserTimeline(currentUser.username, sinceId)
          }
        />
      </section>
    </>
  );
};

export default Home;
