import useMediaQuery from '../../hooks/useMediaQuery';
import Button from '../Button';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';

function UserPanel() {
  const mediumBreakpoint = 700;
  const largeBreakpoint = 900;
  const isMediumUp = useMediaQuery(mediumBreakpoint);
  const isLargeUp = useMediaQuery(largeBreakpoint);

  if (isLargeUp)
    return (
      <div className={styles.group}>
        <Button variant='light'>Sign up</Button>
        <Button variant='light'>Log in</Button>
      </div>
    );

  if (isMediumUp)
    return (
      <img
        src={defaultAvatar}
        alt='default user avatar'
        className={styles.avatar}
      />
    );

  return null;
}

export default UserPanel;
