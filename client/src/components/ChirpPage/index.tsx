import styles from './styles.module.scss';
import { useQuery } from '@tanstack/react-query';
import { Link, useMatch } from '@tanstack/react-location';
import defaultAvatar from '../../assets/images/default_avatar.png';
import ChirpService from '../../api/services/Chirp';
import utils from '../../utils/utils';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import { useState } from 'react';
import ChirpReplies from '../ChirpReplies';
import useLikedChirpIds from '../../hooks/useLikedChirpIds';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import ComposeChirpModal from '../ComposeChirpModal';
import LikesModal from '../LikesModal';
import CreateChirpForm from '../CreateChirpForm';

const ChirpPage = () => {
  const {
    params: { id },
  } = useMatch();
  const queryKeys = [id];
  const { user } = useUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

  const {
    data: chirp,
    isLoading,
    isError,
  } = useQuery(['chirps', ...queryKeys], () => ChirpService.getOne(id));

  const {
    data: likedChirpIds,
    isSuccess,
    isLoading: isLikedLoading,
  } = useLikedChirpIds(queryKeys, user!.username, [id]);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState<boolean>(false);

  const isLiked = isSuccess && likedChirpIds.includes(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Oops something went wrong...</div>;
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
                  Replies
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
              onClick={() => setIsReplyModalOpen(true)}
            >
              <FaRegCommentAlt className={styles.icon} />
            </button>

            <button
              disabled={isLikedLoading}
              type='button'
              className={`${styles.button} ${styles.like} ${
                isLiked ? styles.liked : ''
              }`}
              onClick={() => {
                isLiked ? unlikeChirp(chirp) : likeChirp(chirp);
              }}
            >
              <FaRegHeart className={styles.icon} />
            </button>

            <button type='button' className={styles.button}>
              <FiShare className={styles.icon} />
            </button>
          </div>
          <CreateChirpForm replyToId={chirp._id} />
        </article>

        <ChirpReplies chirp={chirp} />
      </section>

      <ComposeChirpModal
        replyToChirp={chirp}
        isOpen={isReplyModalOpen}
        onRequestClose={() => {
          console.log(isReplyModalOpen);
          setIsReplyModalOpen(false);
        }}
      />

      <LikesModal
        isOpen={isLikesModalOpen}
        onRequestClose={() => setIsLikesModalOpen(false)}
        chirpId={chirp._id}
      />
    </>
  );
};

export default ChirpPage;
