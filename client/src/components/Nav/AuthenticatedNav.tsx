import Nav from '../Nav';
import NavItem from '../Nav/NavItem';
import useUser from '../../hooks/useUser';
import { StoredUser } from '../../interfaces/User';
import { RiHome7Line as HomeIcon } from '@react-icons/all-files/ri/RiHome7Line';
import { RiHome7Fill as ActiveHomeIcon } from '@react-icons/all-files/ri/RiHome7Fill';
import { IoCompassOutline as ExploreIcon } from '@react-icons/all-files/io5/IoCompassOutline';
import { IoCompass as ActiveExploreIcon } from '@react-icons/all-files/io5/IoCompass';
import { HiOutlineSearch as SearchIcon } from '@react-icons/all-files/hi/HiOutlineSearch';
import { FaSearch as ActiveSearchIcon } from '@react-icons/all-files/fa/FaSearch';
import { RiUser3Line as ProfileIcon } from '@react-icons/all-files/ri/RiUser3Line';
import { RiUser3Fill as ActiveProfileIcon } from '@react-icons/all-files/ri/RiUser3Fill';

interface AuthenticatedNavProps {
  showNames?: boolean;
}

const AuthenticatedNav = ({ showNames = true }: AuthenticatedNavProps) => {
  const { user } = useUser() as { user: StoredUser };

  const navItems = [
    {
      to: '/home',
      name: 'Home',
      icon: HomeIcon,
      activeIcon: ActiveHomeIcon,
    },
    {
      to: '/explore',
      name: 'Explore',
      icon: ExploreIcon,
      activeIcon: ActiveExploreIcon,
    },
    {
      to: '/search',
      name: 'Search',
      icon: SearchIcon,
      activeIcon: ActiveSearchIcon,
    },
    {
      to: `/users/${user.username}`,
      name: 'Profile',
      icon: ProfileIcon,
      activeIcon: ActiveProfileIcon,
    },
  ];

  return (
    <Nav showNames={showNames}>
      {navItems.map(({ to, name, icon, activeIcon }) => (
        <NavItem
          key={to}
          to={to}
          name={name}
          icon={icon}
          activeIcon={activeIcon}
          showName={showNames}
        />
      ))}
    </Nav>
  );
};

export default AuthenticatedNav;
