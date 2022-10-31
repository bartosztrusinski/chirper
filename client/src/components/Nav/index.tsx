import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag';
import NavLink from './NavLink';
import styles from './styles.module.scss';

function Nav() {
  return (
    <nav className={styles.nav}>
      <ul role='list' className={styles.list}>
        <li>
          <NavLink to='/home' name='Home' Icon={FaHome} />
        </li>
        <li>
          <NavLink to='/explore' name='Explore' Icon={FaHashtag} />
        </li>
        <li>
          <NavLink to='/search' name='Search' Icon={FaSearch} />
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
