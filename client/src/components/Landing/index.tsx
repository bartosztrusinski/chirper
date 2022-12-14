import { RiTwitterLine } from '@react-icons/all-files/ri/RiTwitterLine';
import { Navigate } from '@tanstack/react-location';
import { useContext } from 'react';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import { PromptContext } from '../UnauthenticatedApp';
import styles from './styles.module.scss';

const Landing = () => {
  const { user } = useUser();
  const promptContext = useContext(PromptContext);

  return user ? (
    <Navigate to='/home' />
  ) : (
    <main className={styles.main}>
      <article className={styles.welcome}>
        <RiTwitterLine className={styles.icon} />
        <h1>Welcome to Chirper!</h1>
      </article>
      <article className={styles.hero}>
        <section className={styles.card}>
          <h2>Don&apos;t miss what&apos;s happening</h2>
          <p>People on Chirper are the first to know</p>
        </section>
        <section className={styles.card}>
          <h2>Join Chirper today</h2>
          <div className={styles.group}>
            <Button variant='light' onClick={promptContext?.openSignUp}>
              Sign up
            </Button>
            <Button variant='light' onClick={promptContext?.openLogIn}>
              Log in
            </Button>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Landing;
