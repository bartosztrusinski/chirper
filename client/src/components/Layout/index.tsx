import { ReactNode, useContext, useEffect } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import UserPanel from '../UserPanel';
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
import useBreakpoint from '../../hooks/useBreakpoint';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const promptContext = useContext(PromptContext);
  const createChirpContext = useContext(CreateChirpContext);
  const { user } = useUser();
  const { logOut } = useAuth();
  const isScreenSmallUp = useBreakpoint('up', 'small');
  const isScreenMediumUp = useBreakpoint('up', 'medium');
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
              !user && styles.withPanel
            }`}
          >
            {user ? (
              <>
                <AuthenticatedNav showNames={isScreenXLargeUp} />

                <Button
                  className={styles.button}
                  onClick={() => createChirpContext?.openCreateChirpModal()}
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
            ) : (
              <UnauthenticatedNav showNames={isScreenXLargeUp} />
            )}
          </aside>
        )}

        <main className={styles.main}>{children}</main>

        {isScreenLargeUp && (
          <aside className={`${styles.sidebar} ${!user && styles.withPanel}`}>
            <UserPanel />
          </aside>
        )}
      </div>

      {!isScreenSmallUp && user && (
        <Button
          className={styles.createChirpButton}
          onClick={() => createChirpContext?.openCreateChirpModal()}
        >
          <CreateChirpIcon className={styles.icon} />
        </Button>
      )}

      {!user && (
        <div className={styles.authPanel}>
          {isScreenMediumUp && (
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
