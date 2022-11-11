import styles from './styles.module.scss';
import { Link } from '@tanstack/react-location';
import { IconType } from '@react-icons/all-files';
import { ComponentPropsWithoutRef } from 'react';

interface Props extends ComponentPropsWithoutRef<'a'> {
  Icon: IconType;
  to: string;
  name: string;
  showNames?: boolean;
}

const NavLink = ({ Icon, to, name, showNames = true, ...restProps }: Props) => {
  const classes = [
    styles.link,
    restProps.className,
    showNames && styles.showNames,
  ].join(' ');

  return (
    <Link
      to={to}
      getActiveProps={() => ({ className: styles.active })}
      {...restProps}
      className={classes}
    >
      <Icon className={styles.icon} />
      <span className={showNames ? '' : 'visually-hidden'}>{name}</span>
    </Link>
  );
};

export default NavLink;
