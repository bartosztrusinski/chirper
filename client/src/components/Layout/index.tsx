import { ReactNode } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import Nav from '../Nav';
import useMediaQuery from '../../hooks/useMediaQuery';
import UserPanel from '../UserPanel';
import Sidebar from './Sidebar';

interface Props {
  children?: ReactNode;
  title: string;
}

function Layout({ children, title }: Props) {
  const breakpoint = 700;
  const isMediumUp = useMediaQuery(breakpoint);

  return (
    <>
      <Header title={title} />
      <div className={styles.container}>
        <div className={styles.grid}>
          {isMediumUp && (
            <Sidebar>
              <Nav />
            </Sidebar>
          )}
          <main className={styles.main}>{children}</main>
          {isMediumUp && (
            <Sidebar>
              <UserPanel />
            </Sidebar>
          )}
        </div>
      </div>
    </>
  );
}

export default Layout;
