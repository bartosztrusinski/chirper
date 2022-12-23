import Button from '../Button';
import { User } from '../../interfaces/User';
import defaultAvatar from '../../assets/images/default_avatar.png';
import styles from './styles.module.scss';
import { Link, useNavigate } from '@tanstack/react-location';
import useUser from '../../hooks/useUser';
import { forwardRef } from 'react';

interface UserProps {
  user: User;
  isFollowed: boolean;
  onFollow: (username: string) => void;
}

type Ref = HTMLDivElement | null;

const User = forwardRef<Ref, UserProps>(function User(
  { user, isFollowed, onFollow },
  ref,
) {
  const { user: currentUser } = useUser();
  const navigate = useNavigate();
  const isCurrentUser = currentUser?.username === user.username;

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
          {!isCurrentUser && currentUser && (
            <Button
              type='button'
              variant='light'
              className={styles.followButton}
              onClick={(e) => {
                e.stopPropagation();
                onFollow(user.username);
              }}
            >
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
        {user.profile.bio && <p>{user.profile.bio}</p>}
      </div>
    </div>
  );
});

export default User;
