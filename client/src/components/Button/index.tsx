import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
  variant?: 'primary' | 'light' | 'dark';
  className?: string;
  [key: string]: unknown;
}

function Button({
  children,
  className,
  variant = 'primary',
  ...restProps
}: Props) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...restProps}>
      {children}
    </button>
  );
}

export default Button;
