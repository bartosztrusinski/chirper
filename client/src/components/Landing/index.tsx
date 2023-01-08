import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import { Navigate, useNavigate } from '@tanstack/react-location';
import { useContext } from 'react';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import Description from '../Description';
import Heading from '../Heading';
import { PromptContext } from '../UnauthenticatedApp';
import styles from './styles.module.scss';

const Landing = () => {
  const { user } = useUser();
  const promptContext = useContext(PromptContext);
  const navigate = useNavigate();

  return user ? (
    <Navigate to='/home' />
  ) : (
    <main className={styles.main}>
      <article className={styles.welcome}>
        <ChirperIcon className={styles.icon} />
        <h1>
          <Heading size='large'>Welcome to Chirper!</Heading>
        </h1>
      </article>
      <article className={styles.hero}>
        <section className={styles.card}>
          <h2>
            <Heading size='medium'>
              Don&apos;t miss what&apos;s happening
            </Heading>
          </h2>
          <Description>People on Chirper are the first to know</Description>
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
