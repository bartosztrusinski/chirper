import styles from './styles.module.scss';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

interface HeadingProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  size: 'small' | 'medium' | 'large';
}

const Heading = ({ children, size, className, ...restProps }: HeadingProps) => {
  const classes = [styles.heading, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...restProps} className={classes}>
      {children}
    </div>
  );
};

export default Heading;
