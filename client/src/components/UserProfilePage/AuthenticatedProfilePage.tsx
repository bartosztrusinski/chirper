import styles from './styles.module.scss';
import UserService from '../../api/services/User';
import defaultAvatar from '../../assets/images/default_avatar.png';
import useUser from '../../hooks/useUser';
import useFollowUser from '../../hooks/useFollowUser';
import EditProfileModal from '../EditProfileModal';
import ConfirmModal from '../ConfirmModal';
import Button from '../Button';
import Loader from '../Loader';
import formatCount from '../../utils/formatCount';
import formatTime from '../../utils/formatTime';
import { useEffect, useState } from 'react';
import { IoCalendarOutline as DateIcon } from '@react-icons/all-files/io5/IoCalendarOutline';
import { HiOutlineLocationMarker as LocationIcon } from '@react-icons/all-files/hi/HiOutlineLocationMarker';
import { BiLinkAlt as WebsiteIcon } from '@react-icons/all-files/bi/BiLinkAlt';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StoredUser } from '../../interfaces/User';
import {
  Link,
  MakeGenerics,
  Outlet,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import Modal from '../Modal';
import UserList from '../UserList';

type LocationGenerics = MakeGenerics<{
  Params: { username: string };
  Search: { dialog?: 'followed' | 'following' | 'edit-profile' };
}>;

const AuthenticatedProfilePage = () => {
  const {
    params: { username },
  } = useMatch<LocationGenerics>();
  const queryKeys = [username];
  const followedQueryKeys = [username, 'followed'];
  const followingQueryKeys = [username, 'following'];
  const queryClient = useQueryClient();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const { user: currentUser } = useUser() as { user: StoredUser };
  const { followUser, unfollowUser } = useFollowUser(queryKeys);

  const isCurrentUserProfile = currentUser.username === username;

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(
    dialog === 'edit-profile' && isCurrentUserProfile,
  );
  const [isFollowedModalOpen, setIsFollowedModalOpen] = useState<boolean>(
    dialog === 'followed',
  );
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState<boolean>(
    dialog === 'following',
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(
    ['users', ...queryKeys],
    async () => {
      const user = await UserService.getOne(username);
      const followedUsernames = await UserService.getFollowedUsernames(
        currentUser.username,
        [user._id],
      );

      return { ...user, isFollowed: followedUsernames.includes(user.username) };
    },
    { retry: false },
  );

  const closeDialog = () =>
    navigate({
      search: (old) => ({ ...old, dialog: undefined }),
      replace: true,
    });

  useEffect(() => {
    setIsFollowedModalOpen(dialog === 'followed');
    setIsFollowingModalOpen(dialog === 'following');
    setIsEditModalOpen(dialog === 'edit-profile' && isCurrentUserProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div>
        <p> Oops something went wrong...</p>
        <Button
          onClick={() =>
            queryClient.refetchQueries(['users', ...queryKeys], {
              exact: true,
            })
          }
        >
          Retry
        </Button>
      </div>
    );
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
            onClick={() => {
              if (isCurrentUserProfile) {
                navigate({ search: { dialog: 'edit-profile' }, replace: true });
              } else if (user.isFollowed) {
                setIsConfirmModalOpen(true);
              } else {
                followUser(user.username);
              }
            }}
          >
            {isCurrentUserProfile
              ? 'Edit Profile'
              : user.isFollowed
              ? 'Unfollow'
              : 'Follow'}
          </Button>
        </div>

        {user.profile.bio && <p className={styles.bio}>{user.profile.bio}</p>}

        <div className={styles.overview}>
          <div className={styles.item}>
            <DateIcon className={styles.icon} />
            <div>Joined {formatTime(user.createdAt).formattedDate}</div>
          </div>
          {user.profile.location && (
            <div className={styles.item}>
              <LocationIcon className={styles.icon} />
              <div className={styles.text}>{user.profile.location}</div>
            </div>
          )}
          {user.profile.website && (
            <div className={styles.item}>
              <WebsiteIcon className={styles.icon} />
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
            onClick={() =>
              navigate({ search: { dialog: 'followed' }, replace: true })
            }
          >
            <div className={styles.count}>
              {formatCount(user.metrics.followedCount)}
            </div>
            Followed
          </button>
          <div className={styles.line}></div>
          <button
            type='button'
            className={styles.button}
            onClick={() =>
              navigate({ search: { dialog: 'following' }, replace: true })
            }
          >
            <div className={styles.count}>
              {formatCount(user.metrics.followingCount)}
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

      <Outlet />

      <EditProfileModal isOpen={isEditModalOpen} onRequestClose={closeDialog} />

      <Modal
        isOpen={isFollowedModalOpen}
        onRequestClose={closeDialog}
        header={<h1 className={styles.followModalHeading}>Followed</h1>}
      >
        <section>
          <UserList
            queryKeys={followedQueryKeys}
            queryFn={(sinceId?: string) =>
              UserService.getManyFollowed(user.username, sinceId)
            }
          />
        </section>
      </Modal>

      <Modal
        isOpen={isFollowingModalOpen}
        onRequestClose={closeDialog}
        header={<h1 className={styles.followModalHeading}>Following</h1>}
      >
        <section>
          <UserList
            queryKeys={followingQueryKeys}
            queryFn={(sinceId?: string) =>
              UserService.getManyFollowing(user.username, sinceId)
            }
          />
        </section>
      </Modal>

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

export default AuthenticatedProfilePage;
