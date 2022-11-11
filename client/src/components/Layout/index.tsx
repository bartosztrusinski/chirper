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

const Layout = ({ children, title }: Props) => {
  const smallBreakpoint = 536;
  const largeBreakpoint = 940;
  const xLargeBreakpoint = 1150;
  const isSmallUp = useMediaQuery(`(min-width: ${smallBreakpoint}px)`);
  const isLargeUp = useMediaQuery(`(min-width: ${largeBreakpoint}px)`);
  const isXLargeUp = useMediaQuery(`(min-width: ${xLargeBreakpoint}px)`);

  return (
    <div className={styles.container}>
      <Header title={title} />
      <div className={styles.grid}>
        {isSmallUp && (
          <Sidebar>
            <Nav showNames={isXLargeUp} />
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
