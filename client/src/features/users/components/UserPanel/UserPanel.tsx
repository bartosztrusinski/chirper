import styles from './UserPanel.module.scss';
import Button from '../../../../components/ui/Button';
import useCurrentUser from '../../hooks/useCurrentUser';
import useBreakpoint from '../../../../hooks/useBreakpoint';
import defaultAvatar from '../../../../assets/images/default_avatar.png';
import toast from 'react-hot-toast';
import { useAuth } from '../../../auth';
import { Link, useNavigate } from '@tanstack/react-location';
import { LocationGenerics } from '../../../../interface';

const UserPanel = () => {
  const navigate = useNavigate<LocationGenerics>();
  const { currentUser } = useCurrentUser();
  const { logOut } = useAuth();
  const isScreenSmallUp = useBreakpoint('up', 'small');

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.userPanel}>
      <Link
        to={`/users/${currentUser.username}`}
        className={styles.userContainer}
      >
        <img
          src={currentUser.profile.picture ?? defaultAvatar}
          alt={`${currentUser.username}'s avatar`}
          className={styles.avatar}
        />
        <div className={styles.usernames}>
          <div className={styles.name}>{currentUser.profile.name}</div>
          <div className={styles.username}>@{currentUser.username}</div>
        </div>
      </Link>

      <div className={styles.followContainer}>
        <button
          type='button'
          className={styles.button}
          onClick={() =>
            navigate({
              to: `/users/${currentUser.username}`,
              search: { dialog: 'followed' },
            })
          }
        >
          <div className={styles.count}>
            {currentUser.metrics.followedCount}
          </div>
          Followed
        </button>
        <div className={styles.line}></div>
        <button
          type='button'
          className={styles.button}
          onClick={() =>
            navigate({
              to: `/users/${currentUser.username}`,
              search: { dialog: 'following' },
            })
          }
        >
          <div className={styles.count}>
            {currentUser.metrics.followingCount}
          </div>
          Following
        </button>
      </div>

      {isScreenSmallUp && (
        <div className={styles.buttonContainer}>
          <Button
            variant='light'
            type='button'
            onClick={() =>
              navigate({
                to: `/users/${currentUser.username}`,
                search: { dialog: 'edit-profile' },
              })
            }
          >
            Edit Profile
          </Button>
          <Button
            variant='light'
            type='button'
            onClick={() => {
              logOut();
              toast.success('Logged out');
            }}
          >
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
