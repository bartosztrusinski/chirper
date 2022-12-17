import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import utils from '../../utils/utils';
import Chirp from '../../interfaces/Chirp';
import { forwardRef, useContext } from 'react';
import { Link } from '@tanstack/react-location';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import { CreateChirpContext } from '../AuthenticatedApp';
import { PromptContext } from '../UnauthenticatedApp';
import useUser from '../../hooks/useUser';

interface ChirpProps {
  chirp: Chirp;
  showMetrics?: boolean;
  isLiked?: boolean;
  onLike: () => void;
}

type Ref = HTMLElement | null;

const Chirp = forwardRef<Ref, ChirpProps>(function Chirp(
  { chirp, showMetrics = true, isLiked = false, onLike },
  ref,
) {
  const createChirpContext = useContext(CreateChirpContext);
  const promptContext = useContext(PromptContext);
  const { user } = useUser();

  return (
    <article ref={ref}>
      <Link to={`/chirps/${chirp._id}`} className={styles.chirp}>
        <Link to={`/users/${chirp.author.username}`}>
          <img
            src={chirp.author.profile.picture ?? defaultAvatar}
            alt={`${chirp.author.username}'s avatar`}
            className={styles.avatar}
          />
        </Link>

        <div className={styles.mainContainer}>
          <div className={styles.upperPanel}>
            <div>
              <Link
                to={`/users/${chirp.author.username}`}
                className={styles.name}
              >
                {chirp.author.profile.name}
              </Link>
              <Link
                to={`/users/${chirp.author.username}`}
                className={styles.username}
              >
                @{chirp.author.username}
              </Link>
            </div>
            <div>·</div>
            <time className={styles.time} dateTime={chirp.createdAt}>
              {utils.formatRelativeTime(chirp.createdAt)}
            </time>
          </div>

          <p className={styles.content}>{chirp.content}</p>

          {showMetrics && (
            <div className={styles.metrics}>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  user
                    ? createChirpContext?.openCreateChirpModal(chirp)
                    : promptContext?.openReplyPrompt(chirp.author.username);
                }}
                className={styles.replies}
              >
                <button className={styles.iconBackground}>
                  <FaRegCommentAlt className={styles.icon} />
                </button>
                <div>{utils.formatCount(chirp.replies.length)}</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  onLike();
                }}
                className={`${styles.likes} ${isLiked ? styles.liked : ''}`}
              >
                <button className={styles.iconBackground}>
                  <FaRegHeart className={styles.icon} />
                </button>
                <div>{utils.formatCount(chirp.metrics.likeCount)}</div>
              </div>
              <div
                className={styles.share}
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/chirps/${chirp._id}`,
                  );
                }}
              >
                <button className={styles.iconBackground}>
                  <FiShare className={styles.icon} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
});

export default Chirp;
