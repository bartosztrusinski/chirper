import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  children?: ReactNode;
}

function Sidebar({ children }: Props) {
  return <aside className={styles.sidebar}>{children}</aside>;
}

export default Sidebar;
