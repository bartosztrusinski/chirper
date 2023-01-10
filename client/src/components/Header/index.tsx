import styles from './styles.module.scss';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import SearchForm from '../SearchForm';
import useBreakpoint from '../../hooks/useBreakpoint';
import DarkModeToggle from '../Toggle/DarkModeToggle';
import { useEffect, useState } from 'react';
import { TiThMenuOutline as MenuIcon } from '@react-icons/all-files/ti/TiThMenuOutline';
import MenuModal from '../MenuModal';
import useUser from '../../hooks/useUser';
import defaultAvatar from '../../assets/images/default_avatar.png';
import {
  Link,
  MakeGenerics,
  useLocation,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import Heading from '../Heading';

type LocationGenerics = MakeGenerics<{
  Search: {
    dialog?: 'menu';
  };
}>;

const Header = () => {
  const navigate = useNavigate<LocationGenerics>();
  const location = useLocation<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const { currentUser } = useUser();
  const isScreenSmallUp = useBreakpoint('up', 'small');
  const isScreenMediumUp = useBreakpoint('up', 'medium');
  const [title, setTitle] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(dialog === 'menu');

  const isSearchPage = location.current.pathname === '/search';
  const { title: docTitle } = document;

  useEffect(() => {
    setTitle(docTitle);
  }, [docTitle]);

  useEffect(() => {
    setIsMenuOpen(dialog === 'menu');
  }, [dialog]);

  const closeDialog = () => {
    navigate({
      search: (old) => ({ ...old, dialog: undefined }),
      replace: true,
    });
  };

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <div
          className={`${styles.name} ${
            isScreenMediumUp ? '' : 'visually-hidden'
          }`}
        >
          Chirper
        </div>
        <ChirperIcon className={styles.icon} />
      </Link>

      {isSearchPage || isScreenSmallUp ? (
        <SearchForm />
      ) : (
        <Heading size='medium' className={styles.heading}>
          {title}
        </Heading>
      )}

      {isScreenSmallUp ? (
        <DarkModeToggle />
      ) : (
        <button
          className={styles.menu}
          onClick={() =>
            navigate({
              search: (old) => ({ ...old, dialog: 'menu' }),
              replace: true,
            })
          }
        >
          {currentUser ? (
            <img
              className={styles.image}
              src={currentUser.profile.picture ?? defaultAvatar}
              alt={`${currentUser.username}'s avatar`}
            />
          ) : (
            <MenuIcon className={styles.icon} />
          )}
        </button>
      )}

      <MenuModal
        isOpen={isMenuOpen && !isScreenSmallUp}
        onRequestClose={closeDialog}
      />
    </header>
  );
};

export default Header;
