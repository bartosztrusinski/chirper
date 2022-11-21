import { Link } from '@tanstack/react-location';
import { useRef, useState } from 'react';
import useAutosizeTextArea from '../../hooks/useAutosizeTextarea';
import useUser from '../../hooks/useUser';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';

const ComposeChirpForm = () => {
  const { user } = useUser();
  const [value, setValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  const avatar = user!.profile.picture ?? defaultAvatar;

  return (
    <div className={styles.reply} onClick={() => textAreaRef.current?.focus()}>
      <div>
        <Link to={`/users/${user!.username}`}>
          <img
            src={avatar}
            alt={`${user!.username}'s  avatar`}
            className={styles.avatar}
          />
        </Link>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={handleChange}
          placeholder="What's happening"
          className={styles.textarea}
          rows={1}
        ></textarea>
        <Button className={styles.submit} disabled={!value} type='submit'>
          Reply
        </Button>
      </form>
    </div>
  );
};

export default ComposeChirpForm;
