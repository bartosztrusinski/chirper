import { Link } from '@tanstack/react-location';
import { useContext, useRef } from 'react';
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
import useManageChirp from '../../hooks/useManageChirp';
import { CreateChirpContext } from '../AuthenticatedApp';

interface CreateChirpFormProps {
  replyToId?: string;
  autoFocus?: boolean;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({
  content,
});

const CreateChirpForm = ({ replyToId, autoFocus }: CreateChirpFormProps) => {
  const { user: currentUser } = useUser() as { user: StoredUser };
  const { createChirp, isCreatingChirp } = useManageChirp();
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const { closeCreateChirpModal } = useContext(
    CreateChirpContext,
  ) as CreateChirpContext;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(inputsSchema),
    defaultValues: { content: '' },
  });

  const { ref, ...rest } = register('content');

  const onSubmit = (inputs: Inputs) => {
    createChirp(
      { ...inputs, parentChirpId: replyToId },
      {
        onSuccess: () => {
          console.log('Your chirp was created!');
          reset();
          closeCreateChirpModal();
        },
        onError: () => {
          console.log('Something went wrong!');
        },
      },
    );
  };

  const cardClasses = [styles.card, errors.content && styles.invalidInput]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={cardClasses} onClick={() => contentRef.current?.focus()}>
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
            autoFocus={autoFocus}
            disabled={isCreatingChirp}
            placeholder={replyToId ? 'Chirp your reply' : "What's happening?"}
            className={styles.contentInput}
            aria-invalid={errors.content ? 'true' : 'false'}
            {...rest}
          />

          <Button
            type='submit'
            className={styles.submitButton}
            disabled={!isDirty || !isValid || isCreatingChirp}
          >
            {isCreatingChirp ? 'Loading...' : replyToId ? 'Reply' : 'Chirp'}
          </Button>
        </form>
      </div>

      {errors.content && (
        <p role='alert' className={styles.errorMessage}>
          {errors.content.message}
        </p>
      )}
    </>
  );
};

export default CreateChirpForm;
