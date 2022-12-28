import { ComponentPropsWithoutRef } from 'react';
import styles from './styles.module.scss';

type LoaderProps = ComponentPropsWithoutRef<'div'>;

const Loader = ({ className, ...restProps }: LoaderProps) => {
  const classes = [styles.spinner, className].filter(Boolean).join(' ');

  return (
    <div {...restProps} className={classes}>
      <div className={styles.doubleBounce1}></div>
      <div className={styles.doubleBounce2}></div>
    </div>
  );
};

export default Loader;
