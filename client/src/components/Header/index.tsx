import styles from './styles.module.scss';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import SearchForm from '../SearchForm';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Link } from '@tanstack/react-location';
import DarkModeToggle from '../Toggle/DarkModeToggle';

interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  const smallBreakpoint = 536;
  const mediumBreakpoint = 690;
  const isSmallUp = useMediaQuery(`(min-width: ${smallBreakpoint}px)`);
  const isMediumUp = useMediaQuery(`(min-width: ${mediumBreakpoint}px)`);

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <h1
          className={`${styles.heading} ${isMediumUp ? '' : 'visually-hidden'}`}
        >
          Chirper
        </h1>
        <ChirperIcon className={styles.icon} />
      </Link>
      {isSmallUp ? (
        <SearchForm />
      ) : (
        <h2 className={styles.subheading}>{title}</h2>
      )}
      <div className={styles.toggle}>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
