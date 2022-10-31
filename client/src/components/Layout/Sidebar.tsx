import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  children?: ReactNode;
}

function Sidebar({ children }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.stickyContainer}>{children}</div>
    </aside>
  );
}

export default Sidebar;
