import Chirp from '../Chirp';
import Modal from '../Modal';
import IChirp from '../../interfaces/Chirp';
import styles from './styles.module.scss';
import { useRef, useState } from 'react';
import Button from '../Button';
import useAutosizeTextArea from '../../hooks/useAutosizeTextarea';
import { Link } from '@tanstack/react-location';
import defaultAvatar from '../../assets/images/default_avatar.png';

interface Props {
  open: boolean;
  onClose: () => void;
  chirp: IChirp;
}

const ComposeChirpModal = ({ open, onClose, chirp }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chirpContent, setChirpContent] = useState('');

  const avatar = defaultAvatar;

  useAutosizeTextArea(textareaRef.current, chirpContent);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Replying to ${chirp.author.profile.name}`}
    >
      <div className={styles.chirpContainer}>
        <Chirp chirp={chirp} showMetrics={false} />
      </div>
      <div className={styles.line}></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div
          className={styles.reply}
          onClick={() => textareaRef.current?.focus()}
        >
          <Link to={`/users/test1`}>
            <img
              src={avatar}
              alt={`test1's  avatar`}
              className={styles.avatar}
            />
          </Link>
          <textarea
            ref={textareaRef}
            value={chirpContent}
            onChange={(e) => setChirpContent(e.target.value)}
            placeholder='Chirp your reply'
            className={styles.textarea}
            rows={1}
            autoFocus
          ></textarea>
        </div>
        <Button
          disabled={!chirpContent}
          type='submit'
          className={styles.replyButton}
        >
          Reply
        </Button>
      </form>
    </Modal>
  );
};

export default ComposeChirpModal;
