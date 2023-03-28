import styles from './UserProfile.module.scss';
import defaultAvatar from '../../../../assets/images/default_avatar.png';
import { useEffect, useState } from 'react';
import { IoCalendarOutline as DateIcon } from '@react-icons/all-files/io5/IoCalendarOutline';
import { HiOutlineLocationMarker as LocationIcon } from '@react-icons/all-files/hi/HiOutlineLocationMarker';
import { BiLinkAlt as WebsiteIcon } from '@react-icons/all-files/bi/BiLinkAlt';
import { useQueryClient } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFollowUser from '../../hooks/useFollowUser';
import { useModal } from '../../../../context/ModalContext';
import Container from '../../../../components/ui/Container';
import Loader from '../../../../components/ui/Loader';
import Heading from '../../../../components/ui/Heading';
import MutedText from '../../../../components/ui/MutedText';
import Button from '../../../../components/ui/Button';
import formatTime from '../../../../utils/formatTime';
import formatCount from '../../../../utils/formatCount';
import EditProfileModal from '../EditProfileModal';
import Modal from '../../../../components/ui/Modal';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import FollowedUsers from '../FollowedUsers';
import FollowingUsers from '../FollowingUsers';
import userKeys from '../../queryKeys';
import { UserLocationGenerics } from '../../interface';
import { useUserQuery } from '../../hooks/useUsersQuery';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const {
    params: { username },
  } = useMatch<UserLocationGenerics>();
  const queryClient = useQueryClient();
  const navigate = useNavigate<UserLocationGenerics>();
  const { dialog } = useSearch<UserLocationGenerics>();
  const { currentUser } = useCurrentUser();
  const { followUser, unfollowUser } = useFollowUser(userKeys.detail(username));
  const modal = useModal();

  const isCurrentUserProfile = currentUser?.username === username;

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
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { data: user, isLoading, isError } = useUserQuery(username);

  const closeDialog = () =>
    navigate({
      search: (old) => ({ ...old, dialog: undefined }),
      replace: true,
    });

  useEffect(() => {
    document.title = `${username}'s Profile`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsFollowedModalOpen(dialog === 'followed');
    setIsFollowingModalOpen(dialog === 'following');
    setIsEditModalOpen(dialog === 'edit-profile' && isCurrentUserProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (!user && isError) {
    return (
      <Container>
        <Heading size='small'>
          Oops... there&apos;s been problem finding this user 😬
        </Heading>
        <MutedText>
          Try clicking the button below or refreshing the page
        </MutedText>
        <Button
          className={styles.retryButton}
          onClick={() =>
            queryClient.refetchQueries(userKeys.detail(username), {
              exact: true,
            })
          }
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <>
      <h1 className='visually-hidden'>{`${user.username}'s Profile`}</h1>

      <div className={styles.profile}>
        <div className={styles.main}>
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
            className={`${styles.button} ${
              user.isFollowed ? styles.followed : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              if (!currentUser) {
                modal.openFollowPrompt(user.username);
              }

              if (isCurrentUserProfile) {
                navigate({ search: { dialog: 'edit-profile' }, replace: true });
              } else if (user.isFollowed) {
                setIsConfirmModalOpen(true);
              } else {
                followUser(user.username, {
                  onError: () => toast.error('Failed to follow user'),
                });
              }
            }}
          >
            {!currentUser
              ? 'Follow'
              : isCurrentUserProfile
              ? 'Edit Profile'
              : user.isFollowed
              ? isHovered
                ? 'Unfollow'
                : 'Following'
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
        header={
          <Heading size='medium'>
            <h1>Followed</h1>
          </Heading>
        }
      >
        <FollowedUsers username={user.username} />
      </Modal>

      <Modal
        isOpen={isFollowingModalOpen}
        onRequestClose={closeDialog}
        header={
          <Heading size='medium'>
            <h1>Following</h1>
          </Heading>
        }
      >
        <FollowingUsers username={user.username} />
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        heading={`Unfollow @${user.username}?`}
        description='Their Chirps will no longer show up in your home timeline. You can still view their profile.'
        confirmText='Unfollow'
        onConfirm={() => {
          unfollowUser(user.username, {
            onError: () => toast.error('Failed to unfollow user'),
          });
          setIsConfirmModalOpen(false);
        }}
      />
    </>
  );
};

export default UserProfile;
