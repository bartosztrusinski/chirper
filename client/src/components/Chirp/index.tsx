import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import utils from '../../utils/utils';
import Chirp from '../../interfaces/Chirp';
import { forwardRef, MouseEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-location';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';

interface ChirpProps {
  chirp: Chirp;
  showMetrics?: boolean;
  isLiked?: boolean;
  onLike: () => void;
  onReply: () => void;
}

type Ref = HTMLElement | null;

const Chirp = forwardRef<Ref, ChirpProps>(function Chirp(
  { chirp, showMetrics = true, isLiked = false, onLike, onReply },
  ref,
) {
  const { _id, content, createdAt, author, metrics, replies } = chirp;
  const { username, profile } = author;
  const avatar = profile.picture ?? defaultAvatar;
  const navigate = useNavigate();
  const noPropagate = (e: MouseEvent) => e.stopPropagation();
  const relativeCreatedTime = utils.formatRelativeTime(createdAt);

  return (
    <article
      ref={ref}
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
            <div
              onClick={(e) => {
                e.stopPropagation();
                onReply();
              }}
              className={styles.replies}
            >
              <div className={styles.iconBackground}>
                <FaRegCommentAlt className={styles.icon} />
              </div>
              <div>{utils.formatCount(replies.length)}</div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className={`${styles.likes} ${isLiked ? styles.liked : ''}`}
            >
              <div className={styles.iconBackground}>
                <FaRegHeart className={styles.icon} />
              </div>
              <div>{utils.formatCount(metrics.likeCount)}</div>
            </div>
            <div className={styles.share}>
              <div className={styles.iconBackground}>
                <FiShare className={styles.icon} />
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
});

export default Chirp;
