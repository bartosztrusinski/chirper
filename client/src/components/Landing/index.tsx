import { RiTwitterLine } from '@react-icons/all-files/ri/RiTwitterLine';
import { Navigate, useNavigate } from '@tanstack/react-location';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import styles from './styles.module.scss';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useUser();

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
            <Button
              variant='light'
              onClick={() =>
                navigate({ search: (old) => ({ ...old, signup: true }) })
              }
            >
              Sign up
            </Button>
            <Button
              variant='light'
              onClick={() =>
                navigate({ search: (old) => ({ ...old, login: true }) })
              }
            >
              Log in
            </Button>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Landing;
