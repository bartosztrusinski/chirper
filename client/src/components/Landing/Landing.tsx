import { RiTwitterLine } from 'react-icons/ri';
import { GrLinkDown } from 'react-icons/gr';
import Button from '../Button/Button';
import Link from '../Button/Link';
import styles from './Landing.module.scss';

function Landing() {
  return (
    <main>
      <section className={styles.article}>
        <RiTwitterLine className={styles.icon} />
        <h1 className={styles.heading}>Welcome to Chirper!</h1>
        <Link
          href='#article2'
          style={{
            position: 'absolute',
            bottom: '20px',
            borderRadius: '15px',
          }}
        >
          <GrLinkDown />
        </Link>
      </section>
      <div className='grid' id='article2'>
        <section className={styles.section}>
          <h2 className={styles.subheading}>Don’t miss what’s happening</h2>
          <p className={styles.paragraph}>
            People on Chirper are the first to know
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>Join Chirper today</h2>
          <div className={`${styles.group} grid`}>
            <Button variant='light'>Sign up</Button>
            <Button variant='light'>Log in</Button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Landing;
