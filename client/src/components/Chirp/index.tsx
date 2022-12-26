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
import useLikeChirp from '../../hooks/useLikeChirp';

interface ChirpProps {
  chirp: Chirp;
  queryKeys: unknown[];
  showMetrics?: boolean;
}

type Ref = HTMLElement | null;

const Chirp = forwardRef<Ref, ChirpProps>(function Chirp(
  { chirp, queryKeys, showMetrics = true },
  ref,
) {
  const navigate = useNavigate();
  const createChirpContext = useContext(CreateChirpContext);
  const promptContext = useContext(PromptContext);
  const { user: currentUser } = useUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

  const likeClasses = [styles.likes, chirp.isLiked && styles.liked]
    .filter(Boolean)
    .join(' ');

  const handleLike = () => {
    if (!currentUser) {
      promptContext?.openLikePrompt(chirp.author.username);
    } else if (chirp.isLiked) {
      unlikeChirp(chirp);
    } else {
      likeChirp(chirp);
    }
  };

  const handleReply = () => {
    if (currentUser) {
      createChirpContext?.openCreateChirpModal(chirp);
    } else {
      promptContext?.openReplyPrompt(chirp.author.username);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/chirps/${chirp._id}`,
    );
    toast.success('Copied to clipboard');
  };

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
        <Link
          to={`/users/${chirp.author.username}`}
          onClick={(e) => e.stopPropagation()}
        >
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
                className={styles.name}
                to={`/users/${chirp.author.username}`}
                onClick={(e) => e.stopPropagation()}
              >
                {chirp.author.profile.name}
              </Link>
              <Link
                className={styles.username}
                to={`/users/${chirp.author.username}`}
                onClick={(e) => e.stopPropagation()}
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
                className={styles.replies}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReply();
                }}
              >
                <button className={styles.iconBackground}>
                  <FaRegCommentAlt className={styles.icon} />
                </button>
                <div>{formatCount(chirp.replies.length)}</div>
              </div>
              <div
                className={likeClasses}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
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
                  handleShare();
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
