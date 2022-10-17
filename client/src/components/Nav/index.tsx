import { Link } from '@tanstack/react-location';
import styles from './styles.module.scss';
import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag';
import useMediaQuery from '../../hooks/useMediaQuery';

function Nav() {
  const breakpoint = 900;
  const matches = useMediaQuery(breakpoint, 'max');

  return (
    <nav>
      <ul className={styles.list}>
        <li>
          <Link
            to='/home'
            className={styles.link}
            getActiveProps={() => ({ className: styles.active })}
          >
            <FaHome className={styles.icon} />
            <h3
              className={`${styles.heading} ${
                matches ? 'visually-hidden' : ''
              }`}
            >
              Home
            </h3>
          </Link>
        </li>
        <li>
          <Link to='/explore' className={styles.link}>
            <FaHashtag className={styles.icon} />{' '}
            <h3
              className={`${styles.heading} ${
                matches ? 'visually-hidden' : ''
              }`}
            >
              Explore
            </h3>
          </Link>
        </li>
        <li>
          <Link to='/search' className={styles.link}>
            <FaSearch className={styles.icon} />{' '}
            <h3
              className={`${styles.heading} ${
                matches ? 'visually-hidden' : ''
              }`}
            >
              Search
            </h3>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
