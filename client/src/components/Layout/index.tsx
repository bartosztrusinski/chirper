import { ReactNode } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import useMediaQuery from '../../hooks/useMediaQuery';
import UserPanel from '../UserPanel';
import Sidebar from './Sidebar';
import SearchForm from '../SearchForm';
import AuthenticatedNav from '../Nav/AuthenticatedNav';
import UnauthenticatedNav from '../Nav/UnauthenticatedNav';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import { useNavigate } from '@tanstack/react-location';
import { BiLogOut as LogOutIcon } from '@react-icons/all-files/bi/BiLogOut';
import { IoMdAdd as CreateChirpIcon } from '@react-icons/all-files/io/IoMdAdd';
import useAuth from '../../hooks/useAuth';

interface LayountProps {
  children: ReactNode;
}

const Layout = ({ children }: LayountProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logOut } = useAuth();

  const smallBreakpoint = 536;
  const largeBreakpoint = 940;
  const xLargeBreakpoint = 1150;
  const isSmallUp = useMediaQuery(`(min-width: ${smallBreakpoint}px)`);
  const isLargeUp = useMediaQuery(`(min-width: ${largeBreakpoint}px)`);
  const isXLargeUp = useMediaQuery(`(min-width: ${xLargeBreakpoint}px)`);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.grid}>
        {isSmallUp && (
          <Sidebar className={styles.nav}>
            {user ? (
              <>
                <AuthenticatedNav showNames={isXLargeUp} />

                <Button
                  className={styles.button}
                  onClick={() =>
                    navigate({
                      search: (old) => ({ ...old, dialog: 'create-chirp' }),
                    })
                  }
                >
                  {isXLargeUp ? (
                    'Chirp'
                  ) : (
                    <CreateChirpIcon className={styles.icon} />
                  )}
                </Button>

                {!isLargeUp && (
                  <Button
                    variant='dark'
                    className={styles.button}
                    onClick={logOut}
                  >
                    <LogOutIcon className={styles.icon} />
                  </Button>
                )}
              </>
            ) : (
              <UnauthenticatedNav showNames={isXLargeUp} />
            )}
          </Sidebar>
        )}
        <main className={styles.main}>{children}</main>
        {isLargeUp && (
          <Sidebar>
            <UserPanel />
          </Sidebar>
        )}
      </div>
      {!isSmallUp && (
        <div className={styles.bottomPanel}>
          <SearchForm />
        </div>
      )}
    </div>
  );
};

export default Layout;
