import styles from './User.module.scss';
import Button from '../../../../components/ui/Button';
import useCurrentUser from '../../hooks/useCurrentUser';
import defaultAvatar from '../../../../assets/images/default_avatar.png';
import { User } from '../../interface';
import { Link, useNavigate } from '@tanstack/react-location';
import { forwardRef } from 'react';

interface UserProps {
  user: User;
  onFollow: () => void;
}

type Ref = HTMLDivElement | null;

const User = forwardRef<Ref, UserProps>(function User({ user, onFollow }, ref) {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  return (
    <div
      ref={ref}
      className={styles.userContainer}
      tabIndex={0}
      role='button'
      onClick={() => navigate({ to: `/users/${user.username}` })}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          navigate({ to: `/users/${user.username}` });
        }
      }}
    >
      <Link to={`/users/${user.username}`} className={styles.avatarContainer}>
        <img
          src={user.profile.picture ?? defaultAvatar}
          alt={`${user.username}'s avatar`}
          className={styles.avatar}
        />
      </Link>
      <div className={styles.mainContainer}>
        <div className={styles.topPanel}>
          <div className={styles.usernames}>
            <Link className={styles.name} to={`/users/${user.username}`}>
              {user.profile.name}
            </Link>
            <Link className={styles.username} to={`/users/${user.username}`}>
              @{user.username}
            </Link>
          </div>
          {currentUser && currentUser.username !== user.username && (
            <Button
              type='button'
              variant='light'
              className={styles.followButton}
              onClick={(e) => {
                e.stopPropagation();
                onFollow();
              }}
            >
              {user.isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
        {user.profile.bio && <p>{user.profile.bio}</p>}
      </div>
    </div>
  );
});

export default User;
