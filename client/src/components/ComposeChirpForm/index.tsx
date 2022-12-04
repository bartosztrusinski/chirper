import { Link } from '@tanstack/react-location';
import { useRef, useState } from 'react';
import useUser from '../../hooks/useUser';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';
import { StoredUser } from '../../interfaces/User';
import TextareaAutosize from 'react-textarea-autosize';

const ComposeChirpForm = () => {
  const { user: currentUser } = useUser() as { user: StoredUser };
  const [value, setValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <div
      className={styles.container}
      onClick={() => textAreaRef.current?.focus()}
    >
      <div>
        <Link to={`/users/${currentUser.username}`}>
          <img
            src={currentUser.profile.picture ?? defaultAvatar}
            alt={`${currentUser.username}'s  avatar`}
            className={styles.avatar}
          />
        </Link>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextareaAutosize
          ref={textAreaRef}
          value={value}
          onChange={handleChange}
          placeholder="What's happening"
          className={styles.textarea}
          rows={1}
        />
        <Button className={styles.submit} disabled={!value} type='submit'>
          Reply
        </Button>
      </form>
    </div>
  );
};

export default ComposeChirpForm;
