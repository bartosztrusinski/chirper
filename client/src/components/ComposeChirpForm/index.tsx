import { Link } from '@tanstack/react-location';
import { useRef } from 'react';
import useUser from '../../hooks/useUser';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';
import { StoredUser } from '../../interfaces/User';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { content } from './schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({
  content,
});

const ComposeChirpForm = () => {
  const { user: currentUser } = useUser() as { user: StoredUser };
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(inputsSchema),
    defaultValues: { content: '' },
  });

  const { ref, ...rest } = register('content');

  const onSubmit = (inputs: Inputs) => {
    console.log(inputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} onClick={() => contentRef.current?.focus()}>
        <Link to={`/users/${currentUser.username}`}>
          <img
            src={currentUser.profile.picture ?? defaultAvatar}
            alt={`${currentUser.username}'s  avatar`}
            className={styles.avatar}
          />
        </Link>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextareaAutosize
            ref={(e) => {
              ref(e);
              contentRef.current = e;
            }}
            placeholder="What's happening"
            className={styles.chirpContent}
            aria-invalid={errors.content ? 'true' : 'false'}
            {...rest}
          />

          <Button
            type='submit'
            className={styles.submitButton}
            disabled={!isDirty || !isValid}
          >
            Reply
          </Button>
        </form>
      </div>

      {errors.content && (
        <p role='alert' className={styles.errorMessage}>
          {errors.content.message}
        </p>
      )}
    </div>
  );
};

export default ComposeChirpForm;
