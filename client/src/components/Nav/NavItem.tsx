import styles from './styles.module.scss';
import { Link } from '@tanstack/react-location';
import { IconType } from '@react-icons/all-files';
import { ComponentPropsWithoutRef } from 'react';

interface NavItemProps extends ComponentPropsWithoutRef<'a'> {
  to: string;
  name: string;
  showName?: boolean;
  icon: IconType;
  activeIcon: IconType;
}

const NavItem = ({
  icon: Icon,
  activeIcon: ActiveIcon,
  to,
  name,
  showName = true,
  ...restProps
}: NavItemProps) => {
  const classes = [
    styles.link,
    restProps.className,
    showName && styles.nameShown,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li>
      <Link
        to={to}
        getActiveProps={() => ({ className: styles.active })}
        {...restProps}
        className={classes}
      >
        {({ isActive }) => {
          return (
            <>
              {isActive && ActiveIcon ? (
                <ActiveIcon className={styles.icon} />
              ) : (
                <Icon className={styles.icon} />
              )}
              <span className={showName ? '' : 'visually-hidden'}>{name}</span>
            </>
          );
        }}
      </Link>
    </li>
  );
};
export default NavItem;
