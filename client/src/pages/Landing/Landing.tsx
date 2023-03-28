import styles from './Landing.module.scss';
import Heading from '../../components/ui/Heading';
import MutedText from '../../components/ui/MutedText';
import Button from '../../components/ui/Button';
import useCurrentUser from '../../features/users/hooks/useCurrentUser';
import { useModal } from '../../context/ModalContext';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import { Navigate, useNavigate } from '@tanstack/react-location';

const Landing = () => {
  const { currentUser } = useCurrentUser();
  const modal = useModal();
  const navigate = useNavigate();

  return currentUser ? (
    <Navigate to='/home' />
  ) : (
    <main className={styles.main}>
      <article className={styles.welcome}>
        <ChirperIcon className={styles.icon} />
        <Heading size='large'>
          <h1>Welcome to Chirper!</h1>
        </Heading>
      </article>
      <article className={styles.hero}>
        <section className={styles.card}>
          <h2>
            <Heading size='medium'>
              Don&apos;t miss what&apos;s happening
            </Heading>
          </h2>
          <MutedText>People on Chirper are the first to know</MutedText>
          <div className={styles.group}>
            <Button
              variant='light'
              onClick={() => navigate({ to: '/explore' })}
            >
              Explore
            </Button>
          </div>
        </section>
        <section className={styles.card}>
          <h2>
            <Heading size='medium'>Join Chirper today</Heading>
          </h2>
          <div className={styles.group}>
            <Button variant='light' onClick={modal.openSignUp}>
              Sign up
            </Button>
            <Button variant='light' onClick={modal.openLogIn}>
              Log in
            </Button>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Landing;
