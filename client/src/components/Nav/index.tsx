import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag';
import NavLink from './NavLink';
import styles from './styles.module.scss';

interface Props {
  showNames?: boolean;
}

const Nav = ({ showNames = true }: Props) => {
  return (
    <nav>
      <ul
        role='list'
        className={`${styles.list} ${showNames && styles.showNames}`}
      >
        <li>
          <NavLink to='/home' name='Home' Icon={FaHome} showNames={showNames} />
        </li>
        <li>
          <NavLink
            to='/explore'
            name='Explore'
            Icon={FaHashtag}
            showNames={showNames}
          />
        </li>
        <li>
          <NavLink
            to='/search'
            name='Search'
            Icon={FaSearch}
            showNames={showNames}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
