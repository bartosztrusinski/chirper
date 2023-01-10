import { ReactNode, useContext, useEffect } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import UserPanel from '../UserPanel';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import { BiLogOut as LogOutIcon } from '@react-icons/all-files/bi/BiLogOut';
import { IoMdAdd as CreateChirpIcon } from '@react-icons/all-files/io/IoMdAdd';
import useAuth from '../../hooks/useAuth';
import { PromptContext } from '../UnauthenticatedApp';
import { CreateChirpContext } from '../AuthenticatedApp';
import { toast } from 'react-hot-toast';
import useBreakpoint from '../../hooks/useBreakpoint';
import Nav from '../Nav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const promptContext = useContext(PromptContext);
  const createChirpContext = useContext(CreateChirpContext);
  const { user: currentUser } = useUser();
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
              !currentUser && styles.withPanel
            }`}
          >
            <Nav showNames={isScreenXLargeUp} />

            {currentUser && (
              <>
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
            )}
          </aside>
        )}

        <main className={styles.main}>{children}</main>

        {isScreenLargeUp && (
          <aside
            className={`${styles.sidebar} ${!currentUser && styles.withPanel}`}
          >
            <UserPanel />
          </aside>
        )}
      </div>

      {!isScreenSmallUp && currentUser && (
        <Button
          className={styles.createChirpButton}
          onClick={() => createChirpContext?.openCreateChirpModal()}
        >
          <CreateChirpIcon className={styles.icon} />
        </Button>
      )}

      {!currentUser && (
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
