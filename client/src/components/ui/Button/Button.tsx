import { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'light' | 'dark';
}

const Button = ({
  children,
  className,
  variant = 'primary',
  ...restProps
}: ButtonProps) => {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
