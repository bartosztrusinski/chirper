import useMediaQuery from '../../hooks/useMediaQuery';
import Button from '../Button';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';

function UserPanel() {
  const mediumBreakpoint = 700;
  const largeBreakpoint = 900;
  const isMediumUp = useMediaQuery(`(min-width: ${mediumBreakpoint}px)`);
  const isLargeUp = useMediaQuery(`(min-width: ${largeBreakpoint}px)`);

  const userContent = isLargeUp ? (
    <div className={styles.group}>
      <Button variant='light'>Sign up</Button>
      <Button variant='light'>Log in</Button>
    </div>
  ) : isMediumUp ? (
    <img
      src={defaultAvatar}
      alt='default user avatar'
      className={styles.avatar}
    />
  ) : null;

  return userContent;
}

export default UserPanel;
