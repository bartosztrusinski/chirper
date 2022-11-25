import styles from './styles.module.scss';
import { useQuery } from '@tanstack/react-query';
import { Link, useMatch } from '@tanstack/react-location';
import defaultAvatar from '../../assets/images/default_avatar.png';
import ChirpService from '../../api/services/Chirp';
import Button from '../Button';
import utils from '../../utils/utils';
import useAutosizeTextArea from '../../hooks/useAutosizeTextarea';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { FaRegCommentAlt } from '@react-icons/all-files/fa/FaRegCommentAlt';
import { FaRegHeart } from '@react-icons/all-files/fa/FaRegHeart';
import { FiShare } from '@react-icons/all-files/fi/FiShare';
import { useRef, useState } from 'react';
import ChirpReplies from '../ChirpReplies';
import useLikedChirpIds from '../../hooks/useLikedChirpIds';
import useUser from '../../hooks/useUser';
import useLikeChirp from '../../hooks/useLikeChirp';
import ComposeChirpModal from '../ComposeChirpModal';

const ChirpPage = () => {
  const {
    params: { id },
  } = useMatch();
  const queryKeys = [id];
  const { user } = useUser();
  const { likeChirp, unlikeChirp } = useLikeChirp(queryKeys);

  const [value, setValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target?.value;
    setValue(val);
  };

  useAutosizeTextArea(textAreaRef.current, value);

  const {
    data: chirp,
    isLoading,
    isError,
    error,
  } = useQuery(['chirps', ...queryKeys], () => ChirpService.getOne(id));

  const { data: likedChirpIds, isSuccess } = useLikedChirpIds(
    queryKeys,
    user!.username,
    [id],
  );

  const isLiked = isSuccess && likedChirpIds.includes(id);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {(error as Error).message}</p>;
  }

  const { content, author, createdAt, replies, metrics } = chirp;
  const { username, profile } = author;
  const avatar = profile.picture ?? defaultAvatar;
  const { formattedTime, formattedDate } = utils.formatTime(createdAt);

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
            <Link to={`/users/${username}`}>
              <img
                src={avatar}
                alt={`${username}'s  avatar`}
                className={styles.avatar}
              />
            </Link>
            <div className={styles.usernames}>
              <Link to={`/users/${username}`} className={styles.name}>
                {profile.name}
              </Link>
              <Link to={`/users/${username}`} className={styles.username}>
                @{username}
              </Link>
            </div>
          </div>
          <p className={styles.content}>{content}</p>
          <div className={styles.meta}>
            <div className={styles.stats}>
              <div>
                <span className={styles.count}>
                  {utils.formatCount(replies.length || 14204)}
                </span>
                Replies
              </div>
              <div>
                <span className={styles.count}>
                  {utils.formatCount(metrics.likeCount || 32049)}
                </span>
                Likes
              </div>
            </div>
            <div className={styles.date}>
              <span>{formattedTime}</span>
              <span>·</span>
              <span>{formattedDate}</span>
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
              type='button'
              className={`${styles.button} ${styles.like} ${
                isLiked ? styles.liked : ''
              }`}
              onClick={() => {
                isLiked ? unlikeChirp(chirp._id) : likeChirp(chirp._id);
              }}
            >
              <FaRegHeart className={styles.icon} />
            </button>

            <button type='button' className={styles.button}>
              <FiShare className={styles.icon} />
            </button>
          </div>
          <div
            className={styles.reply}
            onClick={() => textAreaRef.current?.focus()}
          >
            <div>
              <Link to={`/users/${username}`}>
                <img
                  src={avatar}
                  alt={`${username}'s  avatar`}
                  className={styles.avatar}
                />
              </Link>
            </div>
            <form className={styles.form}>
              <textarea
                ref={textAreaRef}
                value={value}
                onChange={handleChange}
                placeholder='Chirp your reply'
                className={styles.textarea}
                rows={1}
              ></textarea>
              <Button className={styles.submit} disabled={!value} type='button'>
                Reply
              </Button>
            </form>
          </div>
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
    </>
  );
};

export default ChirpPage;
