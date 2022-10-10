import styles from './Button.module.scss';

interface Props {
  children: React.ReactNode;
  href: string;
  style: React.CSSProperties;
}

function Button({ children, href = '#', style }: Props) {
  return (
    <a className={styles.button} href={href} style={style}>
      {children}
    </a>
  );
}

export default Button;
