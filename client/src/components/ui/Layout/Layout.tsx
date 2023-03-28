import styles from './Layout.module.scss';
import Header from '../Header';
import Button from '../Button';
import Nav from '../Nav';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { ReactNode, useEffect } from 'react';
import { BiLogOut as LogOutIcon } from '@react-icons/all-files/bi/BiLogOut';
import { IoMdAdd as CreateChirpIcon } from '@react-icons/all-files/io/IoMdAdd';
import { toast } from 'react-hot-toast';
import { useModal } from '../../../context/ModalContext';
import { UserPanel, useCurrentUser } from '../../../features/users';
import { AuthBar, AuthPanel, useAuth } from '../../../features/auth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const modal = useModal();
  const { currentUser } = useCurrentUser();
  const { logOut } = useAuth();
  const isScreenSmallUp = useBreakpoint('up', 'small');
  const isScreenLargeUp = useBreakpoint('up', 'large');
  const isScreenXLargeUp = useBreakpoint('up', 'xlarge');

  useEffect(() => {
    const setViewportHeight = () => {
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${window.visualViewport?.height}px`,
      );
    };

    setViewportHeight();

    window.visualViewport?.addEventListener('resize', setViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.grid}>
        {isScreenSmallUp && (
          <aside
            className={`${styles.sidebar} ${styles.nav} ${
              !currentUser && styles.withPanel
            }`}
          >
            <Nav showNames={isScreenXLargeUp} />

            {currentUser && (
              <>
                <Button
                  className={styles.button}
                  onClick={() => modal.openCreateChirp()}
                >
                  {isScreenXLargeUp ? (
                    'Chirp'
                  ) : (
                    <CreateChirpIcon className={styles.icon} />
                  )}
                </Button>

                {!isScreenLargeUp && (
                  <Button
                    variant='dark'
                    className={styles.button}
                    onClick={() => {
                      logOut();
                      toast.success('Logged out');
                    }}
                  >
                    <LogOutIcon className={styles.icon} />
                  </Button>
                )}
              </>
            )}
          </aside>
        )}

        <main className={styles.main}>{children}</main>

        {isScreenLargeUp && (
          <aside
            className={`${styles.sidebar} ${!currentUser && styles.withPanel}`}
          >
            {currentUser ? <UserPanel /> : <AuthPanel />}
          </aside>
        )}
      </div>

      {!isScreenSmallUp && currentUser && (
        <Button
          className={styles.createChirpButton}
          onClick={() => modal.openCreateChirp()}
        >
          <CreateChirpIcon className={styles.icon} />
        </Button>
      )}

      {!currentUser && <AuthBar />}
    </div>
  );
};

export default Layout;
