import styles from './styles.module.scss';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import SearchForm from '../SearchForm';
import useMediaQuery from '../../hooks/useMediaQuery';
import DarkModeToggle from '../Toggle/DarkModeToggle';
import { useEffect, useState } from 'react';
import { FiMenu } from '@react-icons/all-files/fi/FiMenu';
import MenuModal from '../MenuModal';
import useUser from '../../hooks/useUser';
import defaultAvatar from '../../assets/images/default_avatar.png';
import {
  Link,
  MakeGenerics,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';

type LocationGenerics = MakeGenerics<{
  Search: {
    dialog?: 'menu';
  };
}>;

const Header = () => {
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const { user } = useUser();

  const smallBreakpoint = 536;
  const mediumBreakpoint = 690;
  const isSmallUp = useMediaQuery(`(min-width: ${smallBreakpoint}px)`);
  const isMediumUp = useMediaQuery(`(min-width: ${mediumBreakpoint}px)`);

  const [title, setTitle] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(dialog === 'menu');

  useEffect(() => {
    setTitle(document.title);
  }, []);

  useEffect(() => {
    setIsMenuOpen(dialog === 'menu');
  }, [dialog]);

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <div
          className={`${styles.name} ${isMediumUp ? '' : 'visually-hidden'}`}
        >
          Chirper
        </div>
        <ChirperIcon className={styles.icon} />
      </Link>

      <h1 className={`${styles.heading} ${isSmallUp ? 'visually-hidden' : ''}`}>
        {title}
      </h1>

      {isSmallUp ? (
        <>
          <SearchForm />
          <DarkModeToggle />
        </>
      ) : (
        <>
          <button
            className={styles.menu}
            onClick={() =>
              navigate({ search: (old) => ({ ...old, dialog: 'menu' }) })
            }
          >
            {user ? (
              <img
                className={styles.image}
                src={user.profile.picture ?? defaultAvatar}
                alt={`${user.username}'s avatar`}
              />
            ) : (
              <FiMenu className={styles.icon} />
            )}
          </button>

          <MenuModal
            isOpen={isMenuOpen}
            onRequestClose={() =>
              navigate({ search: (old) => ({ ...old, dialog: undefined }) })
            }
          />
        </>
      )}
    </header>
  );
};

export default Header;
