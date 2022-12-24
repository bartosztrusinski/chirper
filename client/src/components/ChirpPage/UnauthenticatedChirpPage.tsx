import styles from './styles.module.scss';
import ChirpService from '../../api/services/Chirp';
import ChirpReplies from '../ChirpReplies';
import defaultAvatar from '../../assets/images/default_avatar.png';
import LikesModal from '../LikesModal';
import Button from '../Button';
import Loader from '../Loader';
import formatCount from '../../utils/formatCount';
import formatTime from '../../utils/formatTime';
import { useContext, useEffect, useState } from 'react';
import { PromptContext } from '../UnauthenticatedApp';
import { toast } from 'react-hot-toast';
import { FaArrowLeft as BackIcon } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaRegCommentAlt as ReplyIcon } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart as LikeIcon } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare as ShareIcon } from '@react-icons/all-files/fi/FiShare';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Link,
  MakeGenerics,
  useLocation,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';

type LocationGenerics = MakeGenerics<{
  Params: { id: string };
  Search: { dialog?: 'likes' };
}>;

const UnauthenticatedChirpPage = () => {
  const queryClient = useQueryClient();
  const location = useLocation<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const {
    params: { id },
  } = useMatch<LocationGenerics>();
  const promptContext = useContext(PromptContext);

  const queryKeys = [id];

  const [isLikesModalOpen, setIsLikesModalOpen] = useState<boolean>(
    dialog === 'likes',
  );

  useEffect(() => {
    setIsLikesModalOpen(dialog === 'likes');
  }, [dialog]);

  const {
    data: chirp,
    isLoading,
    isError,
  } = useQuery(['chirps', ...queryKeys], () => ChirpService.getOne(id), {
    retry: false,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div>
        <p> Oops something went wrong...</p>
        <Button
          onClick={() =>
            queryClient.refetchQueries(['chirps', ...queryKeys], {
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
      <h1 className='visually-hidden'>Conversation</h1>

      <Button
        className={styles.backButton}
        onClick={() => location.history.back()}
      >
        <BackIcon />
        Back
      </Button>

      <section>
        <div className={styles.container}>
          <article className={styles.chirp}>
            <div className={styles.author}>
              <Link to={`/users/${chirp.author.username}`}>
                <img
                  src={chirp.author.profile.picture ?? defaultAvatar}
                  alt={`${chirp.author.username}'s  avatar`}
                  className={styles.avatar}
                />
              </Link>
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
            </div>
            <p className={styles.content}>{chirp.content}</p>
            <div className={styles.meta}>
              <div className={styles.metrics}>
                {chirp.replies.length > 0 && (
                  <div>
                    <span className={styles.count}>
                      {formatCount(chirp.replies.length)}
                    </span>
                    {chirp.replies.length > 1 ? 'Replies' : 'Reply'}
                  </div>
                )}
                {chirp.metrics.likeCount > 0 && (
                  <>
                    <button
                      type='button'
                      className={styles.showLikesButton}
                      onClick={() =>
                        navigate({
                          search: (old) => ({ ...old, dialog: 'likes' }),
                          replace: true,
                        })
                      }
                    >
                      <span className={styles.count}>
                        {formatCount(chirp.metrics.likeCount)}
                      </span>
                      {chirp.metrics.likeCount > 1 ? 'Likes' : 'Like'}
                    </button>

                    <LikesModal
                      isOpen={isLikesModalOpen}
                      onRequestClose={() =>
                        navigate({
                          search: (old) => ({ ...old, dialog: undefined }),
                          replace: true,
                        })
                      }
                      chirpId={chirp._id}
                    />
                  </>
                )}
              </div>
              <div className={styles.date}>
                <span>{formatTime(chirp.createdAt).formattedTime}</span>
                <span>·</span>
                <span>{formatTime(chirp.createdAt).formattedDate}</span>
              </div>
            </div>
            <div className={styles.buttonPanel}>
              <button
                type='button'
                className={styles.button}
                onClick={() =>
                  promptContext?.openReplyPrompt(chirp.author.username)
                }
              >
                <ReplyIcon className={styles.icon} />
              </button>

              <button
                type='button'
                className={`${styles.button} ${styles.like}`}
                onClick={() =>
                  promptContext?.openLikePrompt(chirp.author.username)
                }
              >
                <LikeIcon className={styles.icon} />
              </button>

              <button
                type='button'
                className={styles.button}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Copied to clipboard');
                }}
              >
                <ShareIcon className={styles.icon} />
              </button>
            </div>
          </article>
        </div>

        <ChirpReplies chirp={chirp} />
      </section>
    </>
  );
};

export default UnauthenticatedChirpPage;
