import styles from './ChirpDetail.module.scss';
import defaultAvatar from '../../../../assets/images/default_avatar.png';
import CreateChirpForm from '../CreateChirpForm';
import useLikeChirp from '../../hooks/useLikeChirp';
import useManageChirp from '../../hooks/useManageChirp';
import Container from '../../../../components/ui/Container';
import Loader from '../../../../components/ui/Loader';
import Heading from '../../../../components/ui/Heading';
import MutedText from '../../../../components/ui/MutedText';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import formatCount from '../../../../utils/formatCount';
import formatTime from '../../../../utils/formatTime';
import getRequestErrorMessage from '../../../../utils/getResponseErrorMessage';
import { useModal } from '../../../../context/ModalContext';
import { LikingUsers, useCurrentUser } from '../../../users';
import { ChirpLocationGenerics } from '../../interface';
import { useChirpQuery } from '../../hooks/useChirpsQuery';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaArrowLeft as BackIcon } from '@react-icons/all-files/fa/FaArrowLeft';
import { BiComment as ReplyIcon } from '@react-icons/all-files/bi/BiComment';
import { RiHeart2Line as LikeIconOutline } from '@react-icons/all-files/ri/RiHeart2Line';
import { RiHeart2Fill as LikeIconFill } from '@react-icons/all-files/ri/RiHeart2Fill';
import { RiShareLine as ShareIcon } from '@react-icons/all-files/ri/RiShareLine';
import { BsTrash as DeleteIcon } from '@react-icons/all-files/bs/BsTrash';
import { useQueryClient } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import chirpKeys from '../../queryKeys';

const ChirpDetail = () => {
  const {
    params: { id },
  } = useMatch<ChirpLocationGenerics>();
  const queryClient = useQueryClient();
  const location = useLocation<ChirpLocationGenerics>();
  const navigate = useNavigate<ChirpLocationGenerics>();
  const { dialog } = useSearch<ChirpLocationGenerics>();
  const modal = useModal();
  const { currentUser } = useCurrentUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(chirpKeys.detail(id));
  const { deleteChirp } = useManageChirp();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState<boolean>(
    dialog === 'likes',
  );

  useEffect(() => {
    document.title = 'Chirp';
  }, []);

  useEffect(() => {
    setIsLikesModalOpen(dialog === 'likes');
  }, [dialog]);

  const { data: chirp, isLoading, isError } = useChirpQuery(id);

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (!chirp && isError) {
    return (
      <Container>
        <Heading size='small'>
          Oops... there&apos;s been problem retrieving this Chirp 😬
        </Heading>
        <MutedText>
          Try clicking the button below or refreshing the page
        </MutedText>
        <Button
          className={styles.retryButton}
          onClick={() =>
            queryClient.refetchQueries(chirpKeys.detail(id), {
              exact: true,
            })
          }
        >
          Retry
        </Button>
      </Container>
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
                    modal.openCreateChirp(chirp);
                  } else {
                    modal.openReplyPrompt(chirp.author.username);
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
                    chirp.isLiked
                      ? unlikeChirp(chirp, {
                          onError: () => toast.error('Failed to unlike Chirp'),
                        })
                      : likeChirp(chirp, {
                          onError: () => toast.error('Failed to like Chirp'),
                        });
                  } else {
                    modal.openLikePrompt(chirp.author.username);
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

        <Outlet />
      </section>

      <Modal
        header={
          <Heading size='medium'>
            <h1>Liked by</h1>
          </Heading>
        }
        isOpen={isLikesModalOpen && chirp.metrics.likeCount > 0}
        onRequestClose={() =>
          navigate({
            search: (old) => ({ ...old, dialog: undefined }),
            replace: true,
          })
        }
      >
        <LikingUsers chirpId={chirp._id} />
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
              toast.success('Your Chirp has been deleted', {
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

export default ChirpDetail;
