import styles from './styles.module.scss';
import NavItem from '../Nav/NavItem';
import useUser from '../../hooks/useUser';
import { RiHome7Line as HomeIcon } from '@react-icons/all-files/ri/RiHome7Line';
import { RiHome7Fill as ActiveHomeIcon } from '@react-icons/all-files/ri/RiHome7Fill';
import { IoCompassOutline as ExploreIcon } from '@react-icons/all-files/io5/IoCompassOutline';
import { IoCompass as ActiveExploreIcon } from '@react-icons/all-files/io5/IoCompass';
import { HiOutlineSearch as SearchIcon } from '@react-icons/all-files/hi/HiOutlineSearch';
import { FaSearch as ActiveSearchIcon } from '@react-icons/all-files/fa/FaSearch';
import { RiUser3Line as ProfileIcon } from '@react-icons/all-files/ri/RiUser3Line';
import { RiUser3Fill as ActiveProfileIcon } from '@react-icons/all-files/ri/RiUser3Fill';

interface NavProps {
  showNames?: boolean;
}

const Nav = ({ showNames = true }: NavProps) => {
  const { currentUser } = useUser();

  const exploreItem = {
    to: '/explore',
    name: 'Explore',
    icon: ExploreIcon,
    activeIcon: ActiveExploreIcon,
  };

  const searchItem = {
    to: '/search',
    name: 'Search',
    icon: SearchIcon,
    activeIcon: ActiveSearchIcon,
  };

  const homeItem = {
    to: '/home',
    name: 'Home',
    icon: HomeIcon,
    activeIcon: ActiveHomeIcon,
  };

  const userProfileItem = {
    to: `/users/${currentUser?.username}`,
    name: 'Profile',
    icon: ProfileIcon,
    activeIcon: ActiveProfileIcon,
  };

  const navElements = currentUser
    ? [homeItem, exploreItem, searchItem, userProfileItem]
    : [exploreItem, searchItem];

  return (
    <nav>
      <ul
        role='list'
        className={`${styles.list} ${showNames ? styles.nameShown : ''}`}
      >
        {navElements.map(({ to, name, icon, activeIcon }) => (
          <NavItem
            key={to}
            to={to}
            name={name}
            icon={icon}
            activeIcon={activeIcon}
            showName={showNames}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
