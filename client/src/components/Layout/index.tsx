import { ReactNode } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import Nav from '../Nav';
import useMediaQuery from '../../hooks/useMediaQuery';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';

interface Props {
  children?: ReactNode;
  title: string;
}

function Layout({ children, title }: Props) {
  const mediumBreakpoint = 700;
  const largeBreakpoint = 900;
  const isMediumUp = useMediaQuery(mediumBreakpoint);
  const isLargeUp = useMediaQuery(largeBreakpoint);

  return (
    <>
      <Header title={title} />
      <div className={styles.container}>
        <div className={styles.grid}>
          {isMediumUp && (
            <aside className={styles.nav}>
              <Nav />
            </aside>
          )}
          <main className={styles.main}>{children}</main>
          {isLargeUp ? (
            <aside className={styles.profile}>
              <div className={styles.group}>
                <Button variant='light'>Sign up</Button>
                <Button variant='light'>Log in</Button>
              </div>
            </aside>
          ) : (
            isMediumUp && (
              <aside className={styles.profile}>
                <img
                  src={defaultAvatar}
                  alt='default user avatar'
                  className={styles.avatar}
                />
              </aside>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Layout;
