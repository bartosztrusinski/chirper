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
  const matches = useMediaQuery(breakpoint, 'max');

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <h1 className={`${styles.heading} ${matches ? 'visually-hidden' : ''}`}>
          Chirper
        </h1>
        <RiTwitterLine className={styles.icon} aria-label='lol' />
      </Link>
      <div>
        {matches ? <h2 className={styles.heading}>{title}</h2> : <SearchForm />}
      </div>
      <div style={{ textAlign: 'end' }}>
        <Button>🤔</Button>
      </div>
    </header>
  );
}

export default Header;
