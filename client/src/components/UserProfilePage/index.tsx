import styles from './styles.module.scss';
import {
  Link,
  Outlet,
  useMatches,
  useMatchRoute,
  useNavigate,
} from '@tanstack/react-location';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';
import { useQuery } from '@tanstack/react-query';
import UserService from '../../api/services/User';
import utils from '../../utils/utils';
import { IoCalendarOutline } from '@react-icons/all-files/io5/IoCalendarOutline';
import { HiOutlineLocationMarker } from '@react-icons/all-files/hi/HiOutlineLocationMarker';
import { BiLinkAlt } from '@react-icons/all-files/bi/BiLinkAlt';
import useUser from '../../hooks/useUser';
import EditProfileModal from '../EditProfileModal';
import { useContext, useEffect, useState } from 'react';
import ConfirmModal from '../ConfirmModal';
import useFollowedUsernames from '../../hooks/useFollowedUsernames';
import useFollowUser from '../../hooks/useFollowUser';
import FollowedModal from '../FollowedModal';
import FollowingModal from '../FollowingModal';
import { PromptContext } from '../UnauthenticatedApp';

const UserProfile = () => {
  const [
    {
      params: { username },
    },
    nested,
  ] = useMatches();
  const queryKeys = [username];
  const { user: currentUser } = useUser();
  const { followUser, unfollowUser } = useFollowUser(queryKeys);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const [route, setRoute] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isFollowedModalOpen, setIsFollowedModalOpen] =
    useState<boolean>(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] =
    useState<boolean>(false);

  const path = nested ? nested.pathname.replace(/\/+$/, '') : '';

  const isEditRoute = matchRoute({ to: 'edit-profile' });
  const isFollowedRoute = matchRoute({ to: 'followed' });
  const isFollowingRoute = matchRoute({ to: 'following' });

  useEffect(() => {
    setIsEditModalOpen(!!isEditRoute);
    setIsFollowedModalOpen(!!isFollowedRoute);
    setIsFollowingModalOpen(!!isFollowingRoute);
  }, [isEditRoute, isFollowedRoute, isFollowingRoute]);

  useEffect(() => {
    if (isEditRoute || isFollowedRoute || isFollowingRoute) return;

    setRoute(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const {
    data: user,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(['users', ...queryKeys], () => UserService.getOne(username));

  const {
    data: followedUsernames,
    isSuccess: isFollowedSuccess,
    isLoading: isFollowedLoading,
  } = useFollowedUsernames(queryKeys, isSuccess ? [user._id] : []);

  const promptContext = useContext(PromptContext);

  const isFollowed =
    isSuccess && isFollowedSuccess && followedUsernames.includes(user.username);
  const isCurrentUser =
    isSuccess && currentUser && currentUser._id === user._id;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
  }

  return (
    <>
      <div className={styles.profile}>
        <div className={styles.intro}>
          <img
            className={styles.avatar}
            src={user.profile.picture ?? defaultAvatar}
            alt={`${username}'s avatar`}
          />
          <div className={styles.info}>
            <div className={styles.name}>{user.profile.name}</div>
            <div className={styles.username}>@{user.username}</div>
          </div>
          <Button
            type='button'
            className={styles.button}
            disabled={
              !isCurrentUser && Boolean(currentUser) && isFollowedLoading
            }
            onClick={() => {
              if (!currentUser) {
                promptContext?.openFollowPrompt(user.username);
                return;
              }

              if (isCurrentUser) {
                navigate({ to: 'edit-profile' });
                return;
              }

              if (isFollowed) {
                setIsConfirmModalOpen(true);
              } else {
                followUser(user.username);
              }
            }}
          >
            {!currentUser
              ? 'Follow'
              : isCurrentUser
              ? 'Edit Profile'
              : isFollowedLoading
              ? 'Loading...'
              : isFollowed
              ? 'Unfollow'
              : 'Follow'}
          </Button>
        </div>

        {user.profile.bio && <p className={styles.bio}>{user.profile.bio}</p>}

        <div className={styles.overview}>
          <div className={styles.item}>
            <IoCalendarOutline className={styles.icon} />
            <div>Joined {utils.formatTime(user.createdAt).formattedDate}</div>
          </div>
          {user.profile.location && (
            <div className={styles.item}>
              <HiOutlineLocationMarker className={styles.icon} />
              <div className={styles.text}>{user.profile.location}</div>
            </div>
          )}
          {user.profile.website && (
            <div className={styles.item}>
              <BiLinkAlt className={styles.icon} />
              <a href={user.profile.website} className={styles.text}>
                {user.profile.website.split('//')[1]}
              </a>
            </div>
          )}
        </div>

        <div className={styles.follows}>
          <button
            type='button'
            className={styles.button}
            onClick={() => navigate({ to: 'followed' })}
          >
            <div className={styles.count}>
              {utils.formatCount(user.metrics.followedCount)}
            </div>
            Followed
          </button>
          <div className={styles.line}></div>
          <button
            type='button'
            className={styles.button}
            onClick={() => navigate({ to: 'following' })}
          >
            <div className={styles.count}>
              {utils.formatCount(user.metrics.followingCount)}
            </div>
            Following
          </button>
        </div>
      </div>

      <nav className={styles.nav}>
        <ul role='list' className={styles.list}>
          <li className={styles.item}>
            <Link
              to={`.`}
              className={styles.link}
              getActiveProps={() => ({ className: styles.active })}
              activeOptions={{ exact: true }}
            >
              <div>Chirps</div>
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              to={`with-replies`}
              className={styles.link}
              getActiveProps={() => ({ className: styles.active })}
            >
              <div>Chirps & Replies</div>
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              to={`likes`}
              className={styles.link}
              getActiveProps={() => ({ className: styles.active })}
            >
              <div>Likes</div>
            </Link>
          </li>
        </ul>
      </nav>

      <section>
        <Outlet />
      </section>

      {currentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onRequestClose={() => navigate({ to: route })}
        />
      )}

      <FollowedModal
        isOpen={isFollowedModalOpen}
        onRequestClose={() => navigate({ to: route })}
        username={user.username}
      />
      <FollowingModal
        isOpen={isFollowingModalOpen}
        onRequestClose={() => navigate({ to: route })}
        username={user.username}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        heading={`Unfollow @${user.username}?`}
        description='Their Chirps will no longer show up in your home timeline. You can still view their profile.'
        confirmText='Unfollow'
        onConfirm={() => {
          unfollowUser(user.username);
          setIsConfirmModalOpen(false);
        }}
      />
    </>
  );
};

export default UserProfile;
