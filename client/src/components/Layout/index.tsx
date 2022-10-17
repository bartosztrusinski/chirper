import { ReactNode } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import Nav from '../Nav';
import useMediaQuery from '../../hooks/useMediaQuery';
import defaultAvatar from '../../assets/images/default_avatar.png';

interface Props {
  children?: ReactNode;
  title: string;
}

function Layout({ children, title }: Props) {
  const breakpoint = 700;
  const matches = useMediaQuery(breakpoint);

  return (
    <>
      <Header title={title} />
      <div className={styles.container}>
        <div className={styles.grid}>
          {matches && (
            <aside className={styles.nav}>
              <Nav />
            </aside>
          )}
          <main className={styles.main}>{children}</main>
          {matches && (
            <aside className={styles.profile}>
              <img
                src={defaultAvatar}
                alt='default user avatar'
                className={styles.avatar}
              />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}

export default Layout;
