import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import { Link, useNavigate } from '@tanstack/react-location';
import utils from './utils';
import { MouseEvent } from 'react';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import Chirp from '../../interfaces/Chirp';

interface Props {
  chirp: Chirp;
  showMetrics?: boolean;
}

function Chirp({ chirp, showMetrics = true }: Props) {
  const { _id, content, createdAt, author, metrics, replies } = chirp;
  const { username, profile } = author;
  const avatar = profile.picture ?? defaultAvatar;
  const navigate = useNavigate();
  const noPropagate = (e: MouseEvent) => e.stopPropagation();
  const relativeCreatedTime = utils.formatRelativeTime(createdAt);

  return (
    <article
      onClick={() => navigate({ to: `/chirps/${_id}` })}
      className={styles.chirp}
    >
      <div>
        <Link to={`/users/${username}`} onClick={noPropagate}>
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className={styles.avatar}
          />
        </Link>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.upperPanel}>
          <div>
            <Link
              to={`/users/${username}`}
              className={styles.name}
              onClick={noPropagate}
            >
              {profile.name}
            </Link>
            <Link
              to={`/users/${username}`}
              className={styles.username}
              onClick={noPropagate}
            >
              @{username}
            </Link>
          </div>
          <div>·</div>
          <time className={styles.time} dateTime={createdAt}>
            {relativeCreatedTime}
          </time>
        </div>

        <p className={styles.content}>{content}</p>

        {showMetrics && (
          <div className={styles.metrics}>
            <div className={styles.replies}>
              <FaRegCommentAlt />
              <div>{utils.formatCount(replies.length || 124000)}</div>
            </div>
            <div className={styles.likes}>
              <FaRegHeart />
              <div>{utils.formatCount(metrics.likeCount || 1460)}</div>
            </div>
            <div className={styles.share}>
              <FiShare />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default Chirp;
