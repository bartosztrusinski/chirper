import styles from './styles.module.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useMatch } from '@tanstack/react-location';
import defaultAvatar from '../../assets/images/default_avatar.png';
import ChirpService from '../../api/services/Chirp';
import utils from '../../utils/utils';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { useContext, useState } from 'react';
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

const ChirpPage = () => {
  const {
    params: { id },
  } = useMatch();
  const queryKeys = [id];
  const { user } = useUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

  const queryClient = useQueryClient();

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

  const [isLikesModalOpen, setIsLikesModalOpen] = useState<boolean>(false);

  const createChirpContext = useContext(CreateChirpContext);
  const promptContext = useContext(PromptContext);

  const { deleteChirp } = useManageChirp();

  const isLiked = isSuccess && likedChirpIds.includes(id);

  if (isLoading) {
    return <div>Loading...</div>;
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
      <section className={styles.section}>
        <h2 className='visually-hidden'>Conversation</h2>

        <div className={styles.navigation} onClick={() => history.back()}>
          <FaArrowLeft />
          Back
        </div>

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
                    {utils.formatCount(chirp.replies.length)}
                  </span>
                  {chirp.replies.length > 1 ? 'Replies' : 'Reply'}
                </div>
              )}
              {chirp.metrics.likeCount > 0 && (
                <button
                  type='button'
                  className={styles.showLikesButton}
                  onClick={() => setIsLikesModalOpen(true)}
                >
                  <span className={styles.count}>
                    {utils.formatCount(chirp.metrics.likeCount)}
                  </span>
                  {chirp.metrics.likeCount > 1 ? 'Likes' : 'Like'}
                </button>
              )}
            </div>
            <div className={styles.date}>
              <span>{utils.formatTime(chirp.createdAt).formattedTime}</span>
              <span>·</span>
              <span>{utils.formatTime(chirp.createdAt).formattedDate}</span>
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
              disabled={isLikedLoading}
              type='button'
              className={`${styles.button} ${styles.like} ${
                isLiked ? styles.liked : ''
              }`}
              onClick={() => (isLiked ? unlikeChirp(chirp) : likeChirp(chirp))}
            >
              <FaRegHeart className={styles.icon} />
            </button>

            <button type='button' className={styles.button}>
              <FiShare className={styles.icon} />
            </button>

            {user?._id === chirp.author._id && (
              <button
                type='button'
                className={`${styles.button} ${styles.delete}`}
                onClick={() =>
                  deleteChirp(chirp._id, {
                    onSuccess: () => history.back(),
                  })
                }
              >
                <BsTrash className={styles.icon} />
              </button>
            )}
          </div>
          {user && (
            <div className={styles.replyFormContainer}>
              <CreateChirpForm replyToId={chirp._id} />
            </div>
          )}
        </article>

        <ChirpReplies chirp={chirp} />
      </section>

      <LikesModal
        isOpen={isLikesModalOpen}
        onRequestClose={() => setIsLikesModalOpen(false)}
        chirpId={chirp._id}
      />
    </>
  );
};

export default ChirpPage;
