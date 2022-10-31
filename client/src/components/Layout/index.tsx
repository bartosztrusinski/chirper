import { ReactNode } from 'react';
import styles from './styles.module.scss';
import Header from '../Header';
import Nav from '../Nav';
import useMediaQuery from '../../hooks/useMediaQuery';
import UserPanel from '../UserPanel';
import Sidebar from './Sidebar';
import SearchForm from '../SearchForm';

interface Props {
  children?: ReactNode;
  title: string;
}

function Layout({ children, title }: Props) {
  const breakpoint = 700;
  const isMediumUp = useMediaQuery(`(min-width: ${breakpoint}px)`);

  return (
    <div className={styles.container}>
      <Header title={title} />
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
        {isMediumUp || (
          <div className={styles.bottomPanel}>
            <SearchForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
