import styles from './styles.module.scss';
import { ReactNode } from 'react';

interface MutedTextProps {
  children: ReactNode;
}

const MutedText = ({ children }: MutedTextProps) => {
  return <div className={styles.description}>{children}</div>;
};

export default MutedText;
