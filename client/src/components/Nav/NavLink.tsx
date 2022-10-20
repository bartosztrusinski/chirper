import styles from './styles.module.scss';
import { Link } from '@tanstack/react-location';
import { IconType } from '@react-icons/all-files';

interface Props {
  Icon: IconType;
  to: string;
  name: string;
  isLargeUp: boolean;
}

function NavLink({ Icon, to, name, isLargeUp }: Props) {
  return (
    <Link
      to={to}
      className={styles.link}
      getActiveProps={() => ({ className: styles.active })}
    >
      <Icon className={styles.icon} />
      <h3 className={`${styles.heading} ${isLargeUp ? 'visually-hidden' : ''}`}>
        {name}
      </h3>
    </Link>
  );
}

export default NavLink;
