import styles from './styles.module.scss';
import { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  size: 'small' | 'medium' | 'large';
}

const Heading = ({ children, size }: HeadingProps) => {
  return <div className={`${styles.heading} ${styles[size]}`}>{children}</div>;
};

export default Heading;
