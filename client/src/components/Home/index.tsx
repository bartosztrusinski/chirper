import useUser from '../../hooks/useUser';
import ComposeChirpForm from '../ComposeChirpForm';
import UserTimeline from '../UserTimeline';

const Home = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Oops something went wrong!</div>;
  }

  return (
    <>
      <ComposeChirpForm />
      <UserTimeline username={user.username} />
    </>
  );
};

export default Home;
