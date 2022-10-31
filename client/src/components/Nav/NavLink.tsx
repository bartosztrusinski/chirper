import styles from './styles.module.scss';
import { Link } from '@tanstack/react-location';
import { IconType } from '@react-icons/all-files';
import useMediaQuery from '../../hooks/useMediaQuery';

interface Props {
  Icon: IconType;
  to: string;
  name: string;
}

function NavLink({ Icon, to, name }: Props) {
  const breakpoint = 900;
  const isLargeDown = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);

  return (
    <Link
      to={to}
      className={styles.link}
      getActiveProps={() => ({ className: styles.active })}
    >
      <Icon className={styles.icon} />
      <span className={isLargeDown ? 'visually-hidden' : ''}>{name}</span>
    </Link>
  );
}

export default NavLink;
