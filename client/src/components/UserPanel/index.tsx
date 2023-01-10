import { Link, MakeGenerics, useNavigate } from '@tanstack/react-location';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import useAuth from '../../hooks/useAuth';
import { useContext } from 'react';
import { PromptContext } from '../UnauthenticatedApp';
import toast from 'react-hot-toast';
import useBreakpoint from '../../hooks/useBreakpoint';

type LocationGenerics = MakeGenerics<{
  Search: { dialog?: 'followed' | 'following' | 'edit-profile' };
}>;

const UserPanel = () => {
  const navigate = useNavigate<LocationGenerics>();
  const { currentUser } = useUser();
  const { logOut } = useAuth();
  const promptContext = useContext(PromptContext);
  const isScreenSmallUp = useBreakpoint('up', 'small');

  return currentUser ? (
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
  ) : (
    <div className={styles.buttonContainer}>
      <Button variant='light' onClick={() => promptContext?.openSignUp()}>
        Sign up
      </Button>
      <Button variant='light' onClick={() => promptContext?.openLogIn()}>
        Log in
      </Button>
    </div>
  );
};

export default UserPanel;
