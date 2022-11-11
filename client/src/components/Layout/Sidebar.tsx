import styles from './styles.module.scss';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Sidebar = ({ children }: Props) => {
  return <aside className={styles.sidebar}>{children}</aside>;
};

export default Sidebar;
