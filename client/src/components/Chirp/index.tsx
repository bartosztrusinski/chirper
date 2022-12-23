import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Chirp from '../../interfaces/Chirp';
import { forwardRef, useContext } from 'react';
import { Link, useNavigate } from '@tanstack/react-location';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import { CreateChirpContext } from '../AuthenticatedApp';
import { PromptContext } from '../UnauthenticatedApp';
import useUser from '../../hooks/useUser';
import formatRelativeTime from '../../utils/formatRelativeTime';
import formatCount from '../../utils/formatCount';
import { toast } from 'react-hot-toast';

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
  const navigate = useNavigate();
  const promptContext = useContext(PromptContext);
  const { user } = useUser();

  return (
    <article ref={ref}>
      <div
        tabIndex={0}
        role='button'
        onClick={() => navigate({ to: `/chirps/${chirp._id}` })}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            navigate({ to: `/chirps/${chirp._id}` });
          }
        }}
        className={styles.chirp}
      >
        <Link to={`/users/${chirp.author.username}`}>
          <img
            src={chirp.author.profile.picture ?? defaultAvatar}
            alt={`${chirp.author.username}'s avatar`}
            className={styles.avatar}
          />
        </Link>

        <div className={styles.mainContainer}>
          <div className={styles.upperPanel}>
            <div className={styles.usernames}>
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
            <time dateTime={chirp.createdAt}>
              {formatRelativeTime(chirp.createdAt)}
            </time>
          </div>

          <p className={styles.content}>{chirp.content}</p>

          {showMetrics && (
            <div className={styles.metrics}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  user
                    ? createChirpContext?.openCreateChirpModal(chirp)
                    : promptContext?.openReplyPrompt(chirp.author.username);
                }}
                className={styles.replies}
              >
                <button className={styles.iconBackground}>
                  <FaRegCommentAlt className={styles.icon} />
                </button>
                <div>{formatCount(chirp.replies.length)}</div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className={`${styles.likes} ${isLiked ? styles.liked : ''}`}
              >
                <button className={styles.iconBackground}>
                  <FaRegHeart className={styles.icon} />
                </button>
                <div>{formatCount(chirp.metrics.likeCount)}</div>
              </div>
              <div
                className={styles.share}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/chirps/${chirp._id}`,
                  );
                  toast.success('Copied to clipboard');
                }}
              >
                <button className={styles.iconBackground}>
                  <FiShare className={styles.icon} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

export default Chirp;
