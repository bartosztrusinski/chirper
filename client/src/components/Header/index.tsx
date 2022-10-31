import styles from './styles.module.scss';
import { RiTwitterLine } from '@react-icons/all-files/ri/RiTwitterLine';
import SearchForm from '../SearchForm';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Link } from '@tanstack/react-location';
import DarkModeToggle from '../Toggle/DarkModeToggle';

interface Props {
  title: string;
}

function Header({ title }: Props) {
  const breakpoint = 700;
  const isMediumDown = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);

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
        <RiTwitterLine className={styles.icon} />
      </Link>
      {isMediumDown ? (
        <h2 className={styles.subheading}>{title}</h2>
      ) : (
        <SearchForm />
      )}
      <div className={styles.toggle}>
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
