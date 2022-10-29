import styles from './styles.module.scss';
import { RiTwitterLine } from '@react-icons/all-files/ri/RiTwitterLine';
import Button from '../Button';
import SearchForm from '../SearchForm';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Link } from '@tanstack/react-location';

interface Props {
  title: string;
}

function Header({ title }: Props) {
  const breakpoint = 700;
  const isMediumDown = useMediaQuery(`(max-width: ${breakpoint}px)`);

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <h1
          className={`${styles.heading} ${
            isMediumDown ? 'visually-hidden' : ''
          }`}
        >
          Chirper
        </h1>
        <RiTwitterLine className={styles.icon} aria-label='lol' />
      </Link>
      {isMediumDown ? (
        <h2 className={styles.subheading}>{title}</h2>
      ) : (
        <SearchForm />
      )}
      <div style={{ textAlign: 'end' }}>
        <Button variant='dark'>🤔</Button>
      </div>
    </header>
  );
}

export default Header;
