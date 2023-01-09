import { ComponentPropsWithoutRef } from 'react';
import styles from './styles.module.scss';

interface LineProps extends ComponentPropsWithoutRef<'div'> {
  bold?: boolean;
}

const Line = ({ bold = false, className, ...restProps }: LineProps) => {
  const classes = [styles.line, bold && styles.bold, className]
    .filter(Boolean)
    .join(' ');

  return <div {...restProps} className={classes}></div>;
};

export default Line;
