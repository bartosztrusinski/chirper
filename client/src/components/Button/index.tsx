import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
  variant?: 'primary' | 'light' | 'dark';
}

function Button({ children, variant = 'primary' }: Props) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}

export default Button;
