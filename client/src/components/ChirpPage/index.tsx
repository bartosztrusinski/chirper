import styles from './styles.module.scss';
import ChirpService from '../../api/services/Chirp';
import defaultAvatar from '../../assets/images/default_avatar.png';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import useManageChirp from '../../hooks/useManageChirp';
import CreateChirpForm from '../CreateChirpForm';
import ConfirmModal from '../ConfirmModal';
import Button from '../Button';
import Loader from '../Loader';
import Modal from '../Modal';
import ChirpList from '../ChirpList';
import UserService from '../../api/services/User';
import UserList from '../UserList';
import getRequestErrorMessage from '../../utils/getResponseErrorMessage';
import formatCount from '../../utils/formatCount';
import formatTime from '../../utils/formatTime';
import { useContext, useEffect, useState } from 'react';
import { CreateChirpContext } from '../AuthenticatedApp';
import { PromptContext } from '../UnauthenticatedApp';
import { toast } from 'react-hot-toast';
import { FaArrowLeft as BackIcon } from '@react-icons/all-files/fa/FaArrowLeft';
import { BiComment as ReplyIcon } from '@react-icons/all-files/bi/BiComment';
import { RiHeart2Line as LikeIconOutline } from '@react-icons/all-files/ri/RiHeart2Line';
import { RiHeart2Fill as LikeIconFill } from '@react-icons/all-files/ri/RiHeart2Fill';
import { RiShareLine as ShareIcon } from '@react-icons/all-files/ri/RiShareLine';
import { BsTrash as DeleteIcon } from '@react-icons/all-files/bs/BsTrash';
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

const ChirpPage = () => {
  const {
    params: { id },
  } = useMatch<LocationGenerics>();

  const queryKeys = [id];
  const likingUsersQueryKeys = [...queryKeys, 'liking'];
  const repliesQueryKeys = [...queryKeys, 'replies'];

  const queryClient = useQueryClient();
  const location = useLocation<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const createChirpContext = useContext(CreateChirpContext);
  const promptContext = useContext(PromptContext);
  const { user: currentUser } = useUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);
  const { deleteChirp } = useManageChirp();

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

      if (!currentUser) {
        return chirp;
      }

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

  const LikeIcon = chirp.isLiked ? LikeIconFill : LikeIconOutline;

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
                onClick={() => {
                  if (currentUser) {
                    createChirpContext?.openCreateChirpModal(chirp);
                  } else {
                    promptContext?.openReplyPrompt(chirp.author.username);
                  }
                }}
              >
                <ReplyIcon className={styles.icon} />
              </button>

              <button
                type='button'
                className={`${styles.button} ${styles.like} ${
                  chirp.isLiked ? styles.liked : ''
                }`}
                onClick={() => {
                  if (currentUser) {
                    chirp.isLiked ? unlikeChirp(chirp) : likeChirp(chirp);
                  } else {
                    promptContext?.openLikePrompt(chirp.author.username);
                  }
                }}
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

              {currentUser?._id === chirp.author._id && (
                <button
                  type='button'
                  className={`${styles.button} ${styles.delete}`}
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  <DeleteIcon className={styles.icon} />
                </button>
              )}
            </div>
          </article>
        </div>

        {currentUser && (
          <div className={styles.container}>
            <CreateChirpForm replyToId={chirp._id} />
          </div>
        )}

        <section>
          <ChirpList
            queryKeys={repliesQueryKeys}
            queryFn={(sinceId?: string) =>
              ChirpService.getReplies(chirp._id, sinceId)
            }
          />
        </section>
      </section>

      <Modal
        header={<h1 className={styles.likesModalHeading}>Liked by</h1>}
        isOpen={isLikesModalOpen && chirp.metrics.likeCount > 0}
        onRequestClose={() =>
          navigate({
            search: (old) => ({ ...old, dialog: undefined }),
            replace: true,
          })
        }
      >
        <section>
          <UserList
            queryKeys={likingUsersQueryKeys}
            queryFn={(sinceId?: string) =>
              UserService.getManyLiking(chirp._id, sinceId)
            }
          />
        </section>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen && currentUser?._id === chirp.author._id}
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
  );
};

export default ChirpPage;
