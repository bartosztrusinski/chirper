import styles from './styles.module.scss';
import ChirpService from '../../api/services/Chirp';
import ChirpReplies from '../ChirpReplies';
import defaultAvatar from '../../assets/images/default_avatar.png';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import useManageChirp from '../../hooks/useManageChirp';
import LikesModal from '../LikesModal';
import CreateChirpForm from '../CreateChirpForm';
import ConfirmModal from '../ConfirmModal';
import Button from '../Button';
import Loader from '../Loader';
import formatCount from '../../utils/formatCount';
import formatTime from '../../utils/formatTime';
import getRequestErrorMessage from '../../utils/getResponseErrorMessage';
import { useContext, useEffect, useState } from 'react';
import { CreateChirpContext } from '../AuthenticatedApp';
import { toast } from 'react-hot-toast';
import { FaArrowLeft as BackIcon } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaRegCommentAlt as ReplyIcon } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart as LikeIcon } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare as ShareIcon } from '@react-icons/all-files/fi/FiShare';
import { BsTrash as DeleteIcon } from '@react-icons/all-files/bs/BsTrash';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StoredUser } from '../../interfaces/User';
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

const AuthenticatedChirpPage = () => {
  const queryClient = useQueryClient();
  const location = useLocation<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const {
    params: { id },
  } = useMatch<LocationGenerics>();
  const queryKeys = [id];
  const createChirpContext = useContext(CreateChirpContext);
  const { user: currentUser } = useUser() as { user: StoredUser };
  const { deleteChirp } = useManageChirp();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
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
  } = useQuery(
    ['chirps', ...queryKeys],
    async () => {
      const chirp = await ChirpService.getOne(id);
      const likedChirpIds = await ChirpService.getLikedChirpIds(
        currentUser.username,
        [chirp._id],
      );

      return { ...chirp, isLiked: likedChirpIds.includes(chirp._id) };
    },
    { retry: false },
  );

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
                onClick={() => createChirpContext?.openCreateChirpModal(chirp)}
              >
                <ReplyIcon className={styles.icon} />
              </button>

              <button
                type='button'
                className={`${styles.button} ${styles.like} ${
                  chirp.isLiked ? styles.liked : ''
                }`}
                onClick={() =>
                  chirp.isLiked ? unlikeChirp(chirp) : likeChirp(chirp)
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

              {currentUser._id === chirp.author._id && (
                <>
                  <button
                    type='button'
                    className={`${styles.button} ${styles.delete}`}
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    <DeleteIcon className={styles.icon} />
                  </button>

                  <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onRequestClose={() => setIsConfirmModalOpen(false)}
                    heading='Delete Chirp?'
                    description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Chirper search results."
                    confirmText='Delete'
                    onConfirm={() => {
                      const toastId = toast.loading('Deleting your Chirp...');
                      deleteChirp(chirp._id, {
                        onSuccess: () => {
                          toast.success('Your Chirp was deleted', {
                            id: toastId,
                          });
                          setIsConfirmModalOpen(false);
                          history.back();
                        },
                        onError: (error) => {
                          toast.error(getRequestErrorMessage(error), {
                            id: toastId,
                          });
                        },
                      });
                    }}
                  />
                </>
              )}
            </div>
          </article>
        </div>

        <div className={styles.container}>
          <CreateChirpForm replyToId={chirp._id} />
        </div>

        <ChirpReplies chirp={chirp} />
      </section>
    </>
  );
};

export default AuthenticatedChirpPage;
