import Button from '../Button';
import User from '../../interfaces/User';
import defaultAvatar from '../../assets/images/default_avatar.png';
import styles from './styles.module.scss';
import { Link, useNavigate } from '@tanstack/react-location';

interface Props {
  user: User;
}

const User = ({ user }: Props) => {
  const {
    profile: { bio, name, picture },
    username,
  } = user;
  const avatar = picture || defaultAvatar;

  const navigate = useNavigate();

  return (
    <div
      className={styles.userContainer}
      onClick={() => navigate({ to: `/users/${username}` })}
    >
      <Link to={`/users/${username}`} className={styles.avatarContainer}>
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className={styles.avatar}
        />
      </Link>
      <div className={styles.textContainer}>
        <Link to={`/users/${username}`}>{name}</Link>
        <Link to={`/users/${username}`}>{username}</Link>
        {bio || (
          <div>
            {bio ||
              `
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos animi
        vitae molestiae placeat reprehenderit unde vero aliquam eveniet e
        `}
          </div>
        )}
      </div>
      <Button variant='light' className={styles.follow}>
        Follow
      </Button>
    </div>
  );
};

export default User;
