import styles from './styles.module.scss';
import { ReactElement } from 'react';

interface Props {
  showNames?: boolean;
  children: ReactElement | ReactElement[];
}

const Nav = ({ children, showNames = true }: Props) => {
  return (
    <nav>
      <ul
        role='list'
        className={`${styles.list} ${showNames ? styles.nameShown : ''}`}
      >
        {children}
      </ul>
    </nav>
  );
};

export default Nav;
