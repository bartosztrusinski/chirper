import { ReactNode, useContext, useEffect } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import useMediaQuery from '../../hooks/useMediaQuery';
import UserPanel from '../UserPanel';
import Sidebar from './Sidebar';
import AuthenticatedNav from '../Nav/AuthenticatedNav';
import UnauthenticatedNav from '../Nav/UnauthenticatedNav';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import { BiLogOut as LogOutIcon } from '@react-icons/all-files/bi/BiLogOut';
import { IoMdAdd as CreateChirpIcon } from '@react-icons/all-files/io/IoMdAdd';
import useAuth from '../../hooks/useAuth';
import { PromptContext } from '../UnauthenticatedApp';
import { CreateChirpContext } from '../AuthenticatedApp';
import { toast } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const promptContext = useContext(PromptContext);
  const createChirpContext = useContext(CreateChirpContext);
  const { user } = useUser();
  const { logOut } = useAuth();

  const smallBreakpoint = 536;
  const mediumBreakpoint = 690;
  const largeBreakpoint = 940;
  const xLargeBreakpoint = 1150;
  const isSmallUp = useMediaQuery(`(min-width: ${smallBreakpoint}px)`);
  const isMediumUp = useMediaQuery(`(min-width: ${mediumBreakpoint}px)`);
  const isLargeUp = useMediaQuery(`(min-width: ${largeBreakpoint}px)`);
  const isXLargeUp = useMediaQuery(`(min-width: ${xLargeBreakpoint}px)`);

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
        {isSmallUp && (
          <Sidebar className={`${styles.nav} ${!user && styles.withPanel}`}>
            {user ? (
              <>
                <AuthenticatedNav showNames={isXLargeUp} />

                <Button
                  className={styles.button}
                  onClick={() => createChirpContext?.openCreateChirpModal()}
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
                    onClick={() => {
                      logOut();
                      toast.success('Logged out');
                    }}
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
          <Sidebar className={`${!user && styles.withPanel}`}>
            <UserPanel />
          </Sidebar>
        )}
      </div>

      {!isSmallUp && user && (
        <Button
          className={styles.createChirpButton}
          onClick={() => createChirpContext?.openCreateChirpModal()}
        >
          <CreateChirpIcon className={styles.icon} />
        </Button>
      )}

      {!user && (
        <div className={styles.authPanel}>
          {isMediumUp && (
            <div>
              <div className={styles.mainText}>
                Don&apos;t miss what&apos;s happening
              </div>
              <div className={styles.subText}>
                People on Chirper are the first to know
              </div>
            </div>
          )}
          <Button variant='light' onClick={promptContext?.openLogIn}>
            Log in
          </Button>
          <Button variant='light' onClick={promptContext?.openSignUp}>
            Sign up
          </Button>
        </div>
      )}
    </div>
  );
};

export default Layout;
