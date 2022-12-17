import styles from './styles.module.scss';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

interface SidebarProps extends ComponentPropsWithoutRef<'aside'> {
  children: ReactNode;
}

const Sidebar = ({ children, className, ...restProps }: SidebarProps) => {
  const classes = [styles.sidebar, className].filter(Boolean).join(' ');

  return (
    <aside {...restProps} className={classes}>
      {children}
    </aside>
  );
};

export default Sidebar;
