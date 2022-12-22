import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import ChirpService from '../../api/services/Chirp';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { useContext, useEffect, useState } from 'react';
import ChirpReplies from '../ChirpReplies';
import useLikedChirpIds from '../../hooks/useLikedChirpIds';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import LikesModal from '../LikesModal';
import CreateChirpForm from '../CreateChirpForm';
import { CreateChirpContext } from '../AuthenticatedApp';
import useManageChirp from '../../hooks/useManageChirp';
import Button from '../Button';
import { PromptContext } from '../UnauthenticatedApp';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Loader from '../Loader';
import ConfirmModal from '../ConfirmModal';
import formatCount from '../../utils/formatCount';
import formatTime from '../../utils/formatTime';
import {
  Link,
  MakeGenerics,
  useLocation,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import { toast } from 'react-hot-toast';
import getRequestErrorMessage from '../../utils/getResponseErrorMessage';

type LocationGenerics = MakeGenerics<{
  Params: { id: string };
  Search: { dialog?: 'likes' };
}>;

const ChirpPage = () => {
  const queryClient = useQueryClient();
  const location = useLocation<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const {
    params: { id },
  } = useMatch<LocationGenerics>();
  const { user } = useUser();
  const { deleteChirp } = useManageChirp();
  const createChirpContext = useContext(CreateChirpContext);
  const promptContext = useContext(PromptContext);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const queryKeys = [id];
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

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

  const {
    data: likedChirpIds,
    isSuccess,
    isLoading: isLikedLoading,
  } = useLikedChirpIds(queryKeys, [id]);

  const isLiked = isSuccess && likedChirpIds.includes(id);

  if (isLoading || (user && isLikedLoading)) {
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
      <h2 className='visually-hidden'>Conversation</h2>

      <div
        className={styles.navigation}
        onClick={() => location.history.back()}
      >
        <FaArrowLeft />
        Back
      </div>

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
                  user
                    ? createChirpContext?.openCreateChirpModal(chirp)
                    : promptContext?.openReplyPrompt(chirp.author.username)
                }
              >
                <FaRegCommentAlt className={styles.icon} />
              </button>

              <button
                type='button'
                className={`${styles.button} ${styles.like} ${
                  isLiked ? styles.liked : ''
                }`}
                onClick={() => {
                  if (!user) {
                    promptContext?.openLikePrompt(chirp.author.username);
                    return;
                  }

                  isLiked ? unlikeChirp(chirp) : likeChirp(chirp);
                }}
              >
                <FaRegHeart className={styles.icon} />
              </button>

              <button
                type='button'
                className={styles.button}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Copied to clipboard');
                }}
              >
                <FiShare className={styles.icon} />
              </button>

              {user?._id === chirp.author._id && (
                <>
                  <button
                    type='button'
                    className={`${styles.button} ${styles.delete}`}
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    <BsTrash className={styles.icon} />
                  </button>

                  <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onRequestClose={() => setIsConfirmModalOpen(false)}
                    heading='Delete Chirp?'
                    description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Chirper search results."
                    confirmText='Delete'
                    onConfirm={() =>
                      deleteChirp(chirp._id, {
                        onSuccess: () => {
                          history.back();
                          toast.success('Your Chirp was deleted');
                        },
                        onError: (error) => {
                          toast.error(getRequestErrorMessage(error));
                        },
                      })
                    }
                  />
                </>
              )}
            </div>
          </article>
        </div>

        {user && (
          <div className={styles.container}>
            <CreateChirpForm replyToId={chirp._id} />
          </div>
        )}

        <ChirpReplies chirp={chirp} />
      </section>
    </>
  );
};

export default ChirpPage;
