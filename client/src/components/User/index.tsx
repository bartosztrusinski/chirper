import Button from '../Button';
import { User } from '../../interfaces/User';
import defaultAvatar from '../../assets/images/default_avatar.png';
import styles from './styles.module.scss';
import { Link, useNavigate } from '@tanstack/react-location';
import useUser from '../../hooks/useUser';

interface Props {
  user: User;
  isFollowed: boolean;
  onFollow: (username: string) => void;
}

const User = ({ user, isFollowed, onFollow }: Props) => {
  const { user: currentUser } = useUser();
  const navigate = useNavigate();
  const isCurrentUser = currentUser?.username === user.username;

  return (
    <div
      className={styles.userContainer}
      onClick={() => navigate({ to: `/users/${user.username}` })}
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
          {!isCurrentUser && (
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
};

export default User;
