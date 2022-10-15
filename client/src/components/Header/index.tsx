import Button from '../Button';
import styles from './styles.module.scss';
import { RiTwitterLine } from '@react-icons/all-files/ri/RiTwitterLine';
import useMediaQuery from '../../hooks/useMediaQuery';
import useViewport from '../../hooks/useViewport';

interface Props {
  title: string;
}

function Header({ title }: Props) {
  const breakpoint = 700;
  const matches = useMediaQuery(breakpoint, 'max');
  const { width, height } = useViewport();

  return (
    <header className={styles.header}>
      <section className={styles.logo}>
        <h1 className={`${styles.heading} ${matches ? 'visually-hidden' : ''}`}>
          Chirper
        </h1>
        <RiTwitterLine className={styles.icon} />
      </section>
      <section>
        <h2 className={styles.heading}>{title}</h2>
        <p>
          {width}px, {height}px
        </p>
      </section>
      <section style={{ textAlign: 'end' }}>
        <Button>🤔</Button>
      </section>
    </header>
  );
}

export default Header;
