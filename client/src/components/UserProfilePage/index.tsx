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
import { useEffect, useState } from 'react';

const UserProfile = () => {
  const { user: currentUser } = useUser();

  const [
    {
      params: { username },
    },
    nested,
  ] = useMatches();

  const path = nested ? nested.pathname.replace(/\/+$/, '') : '';

  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const isEditRoute = matchRoute({ to: 'edit-profile' });

  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [route, setRoute] = useState<string>('');

  useEffect(() => {
    setIsEditOpen(!!isEditRoute);
  }, [isEditRoute]);

  useEffect(() => {
    if (isEditRoute) return;

    setRoute(path);
  }, [path]);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ['user', username],
    async () => await UserService.getOne(username),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  const { profile, metrics, createdAt } = user.data;
  const { name, bio, location, picture, website } = profile;
  const { chirpCount, followedCount, followingCount, likedChirpCount } =
    metrics;
  const avatar = picture ?? defaultAvatar;
  const { formattedDate } = utils.formatTime(createdAt);

  return (
    <>
      <div className={styles.profile}>
        <div className={styles.intro}>
          <img
            className={styles.avatar}
            src={avatar}
            alt={`${username}'s avatar`}
          />
          <div className={styles.info}>
            <div className={styles.name}>John Smith 1943</div>
            <div className={styles.username}>@jsmith_1943_some_nick</div>
          </div>
          {currentUser && currentUser._id === user.data._id ? (
            <Button
              className={styles.button}
              type='button'
              onClick={() => navigate({ to: 'edit-profile' })}
            >
              Edit Profile
            </Button>
          ) : (
            <Button className={styles.button}>Follow</Button>
          )}
        </div>

        {bio || (
          <p className={styles.bio}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos
            nostrum tempore magni dolorem tenetur sed voluptatum rem laudantium
            mollitia illum, est aut sequi
          </p>
        )}

        <div className={styles.overview}>
          <div className={styles.item}>
            <IoCalendarOutline className={styles.icon} />
            <div>Joined {formattedDate}</div>
          </div>
          {location || (
            <div className={styles.item}>
              <HiOutlineLocationMarker className={styles.icon} />
              <div className={styles.text}>
                Some City, Some Country Zip-Code, Street 2/4
              </div>
            </div>
          )}
          {!website && (
            <div className={styles.item}>
              <BiLinkAlt className={styles.icon} />
              <div className={styles.text}>
                www.dkpoawfdopefksepofkspeofeskpfose.com/krogprkgdr?koewfes=fsefsdrgr
              </div>
            </div>
          )}
        </div>

        <div className={styles.follows}>
          <div>
            <div className={styles.count}>
              {utils.formatCount(followedCount || 14203)}
            </div>
            Followed
          </div>
          <div className={styles.line}></div>
          <div>
            <div className={styles.count}>
              {utils.formatCount(followingCount)}
            </div>
            Following
          </div>
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
      <EditProfileModal
        open={isEditOpen}
        onClose={() => navigate({ to: route })}
      />
      <section>
        <Outlet />
      </section>
    </>
  );
};

export default UserProfile;
