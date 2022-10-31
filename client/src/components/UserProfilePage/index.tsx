import styles from './styles.module.scss';
import { Link, useMatch, useMatchRoute } from '@tanstack/react-location';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';
import { useQuery } from '@tanstack/react-query';
import UserService from '../../api/services/User';
import ChirpService from '../../api/services/Chirp';
import utils from '../Chirp/utils';
import { IoCalendarOutline } from '@react-icons/all-files/io5/IoCalendarOutline';
import { HiOutlineLocationMarker } from '@react-icons/all-files/hi/HiOutlineLocationMarker';
import { BiLinkAlt } from '@react-icons/all-files/bi/BiLinkAlt';
import Chirp from '../Chirp';

const UserProfile = () => {
  const {
    params: { username },
  } = useMatch();

  const matchRoute = useMatchRoute();

  const withRepliesRoute = matchRoute({ to: '/users/:username/with-replies' });
  const likesRoute = matchRoute({ to: '/users/:username/likes' });

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ['user', username],
    async () => await UserService.getOne(username),
  );

  const {
    data: chirps,
    isLoading: isChirpsLoading,
    isError: isChirpsError,
    error: chirpsError,
  } = useQuery(
    ['chirps', username, likesRoute, withRepliesRoute],
    async () => {
      if (likesRoute) {
        return await ChirpService.getManyLikedByUser(username);
      }
      return await ChirpService.getManyByUser(
        username,
        Boolean(withRepliesRoute),
      );
    },
    {
      enabled: Boolean(user?.data._id),
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  let chirpsElements: JSX.Element | JSX.Element[];
  if (isChirpsLoading) {
    chirpsElements = <div>Loading...</div>;
  } else if (isChirpsError) {
    chirpsElements = <div>{(chirpsError as Error).message}</div>;
  } else {
    chirpsElements = chirps.data.map((chirp) => (
      <Chirp key={chirp._id} chirp={chirp} />
    ));
  }

  const { profile, metrics, createdAt } = user.data;
  const { name, bio, location, picture, website } = profile;
  const { chirpCount, followedCount, followingCount, likedChirpCount } =
    metrics;
  const avatar = picture ?? defaultAvatar;
  const [formattedTime, formattedDate] = utils.formatTime(createdAt);

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
          <Button className={styles.button}>Follow</Button>
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
          {website || (
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
              to={`/users/${username}`}
              className={styles.link}
              getActiveProps={() => ({ className: styles.active })}
              activeOptions={{ exact: true }}
            >
              <div>Chirps</div>
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              to={`/users/${username}/with-replies`}
              className={styles.link}
              getActiveProps={() => ({ className: styles.active })}
            >
              <div>Chirps & Replies</div>
            </Link>
          </li>
          <li className={styles.item}>
            <Link
              to={`/users/${username}/likes`}
              className={styles.link}
              getActiveProps={() => ({ className: styles.active })}
            >
              <div>Likes</div>
            </Link>
          </li>
        </ul>
      </nav>

      <section>{chirpsElements}</section>
    </>
  );
};

export default UserProfile;
