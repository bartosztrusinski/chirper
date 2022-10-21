import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag';
import useMediaQuery from '../../hooks/useMediaQuery';
import NavLink from './NavLink';

function Nav() {
  const breakpoint = 900;
  const isLargeUp = useMediaQuery(breakpoint, 'max');

  return (
    <nav>
      <ul role='list'>
        <li>
          <NavLink to='/home' name='Home' Icon={FaHome} isLargeUp={isLargeUp} />
        </li>
        <li>
          <NavLink
            to='/explore'
            name='Explore'
            Icon={FaHashtag}
            isLargeUp={isLargeUp}
          />
        </li>
        <li>
          <NavLink
            to='/search'
            name='Search'
            Icon={FaSearch}
            isLargeUp={isLargeUp}
          />
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
