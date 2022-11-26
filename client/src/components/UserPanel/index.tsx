import { Link, useNavigate } from '@tanstack/react-location';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import useAuth from '../../hooks/useAuth';

const UserPanel = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logOut } = useAuth();

  return user ? (
    <div className={styles.userPanel}>
      <Link to={`/users/${user.username}`} className={styles.userContainer}>
        <img
          src={user.profile.picture ?? defaultAvatar}
          alt={`${user.username}'s avatar`}
          className={styles.avatar}
        />
        <div className={styles.usernames}>
          <div className={styles.name}>{user.profile.name}</div>
          <div className={styles.username}>@{user.username}</div>
        </div>
      </Link>

      <div className={styles.followContainer}>
        <button
          type='button'
          className={styles.button}
          onClick={() => navigate({ to: `/users/${user.username}/followed` })}
        >
          <div className={styles.count}>{user.metrics.followedCount}</div>
          Followed
        </button>
        <div className={styles.line}></div>
        <button
          type='button'
          className={styles.button}
          onClick={() => navigate({ to: `/users/${user.username}/following` })}
        >
          <div className={styles.count}>{user.metrics.followingCount}</div>
          Following
        </button>
      </div>

      <div className={styles.buttonContainer}>
        <Button
          variant='light'
          onClick={() =>
            navigate({ to: `/users/${user.username}/edit-profile` })
          }
        >
          Edit Profile
        </Button>
        <Button
          variant='light'
          type='button'
          onClick={(e) => {
            e.preventDefault();
            logOut();
          }}
        >
          Log Out
        </Button>
      </div>
    </div>
  ) : (
    <div className={styles.buttonContainer}>
      <Button
        variant='light'
        onClick={() =>
          navigate({ search: (old) => ({ ...old, signup: true }) })
        }
      >
        Sign up
      </Button>
      <Button
        variant='light'
        onClick={() => navigate({ search: (old) => ({ ...old, login: true }) })}
      >
        Log in
      </Button>
    </div>
  );
};

export default UserPanel;
