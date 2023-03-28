import styles from './MutedText.module.scss';
import { ReactNode } from 'react';

interface MutedTextProps {
  children: ReactNode;
}

const MutedText = ({ children }: MutedTextProps) => {
  return <div className={styles.mutedText}>{children}</div>;
};

export default MutedText;
