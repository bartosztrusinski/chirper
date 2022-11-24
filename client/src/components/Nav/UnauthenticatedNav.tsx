import Nav from '../Nav';
import NavItem from '../Nav/NavItem';
import { IoCompassOutline as ExploreIcon } from '@react-icons/all-files/io5/IoCompassOutline';
import { IoCompass as ActiveExploreIcon } from '@react-icons/all-files/io5/IoCompass';
import { HiOutlineSearch as SearchIcon } from '@react-icons/all-files/hi/HiOutlineSearch';
import { FaSearch as ActiveSearchIcon } from '@react-icons/all-files/fa/FaSearch';

interface UnauthenticatedNavProps {
  showNames?: boolean;
}

const UnauthenticatedNav = ({ showNames = true }: UnauthenticatedNavProps) => {
  const navItems = [
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

export default UnauthenticatedNav;
