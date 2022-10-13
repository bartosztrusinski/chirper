import { RiTwitterLine } from '@react-icons/all-files/ri/RiTwitterLine';
import Button from '../Button/Button';
import styles from './Landing.module.scss';

function Landing() {
  return (
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
            <Button variant='light'>Sign up</Button>
            <Button variant='light'>Log in</Button>
          </div>
        </section>
      </article>
    </main>
  );
}

export default Landing;
