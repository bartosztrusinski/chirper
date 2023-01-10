import { Link } from '@tanstack/react-location';
import { useContext, useRef } from 'react';
import useUser from '../../hooks/useUser';
import styles from './styles.module.scss';
import defaultAvatar from '../../assets/images/default_avatar.png';
import Button from '../Button';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { content } from './schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useManageChirp from '../../hooks/useManageChirp';
import { CreateChirpContext } from '../AuthenticatedApp';
import Loader from '../Loader';
import { toast } from 'react-hot-toast';
import getRequestErrorMessage from '../../utils/getResponseErrorMessage';
import { useIsMutating } from '@tanstack/react-query';

interface CreateChirpFormProps {
  replyToId?: string;
  autoFocus?: boolean;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({ content });

const CreateChirpForm = ({ replyToId, autoFocus }: CreateChirpFormProps) => {
  const isCreatingChirp = useIsMutating(['chirps', 'create']);
  const { currentUser } = useUser();
  const { createChirp } = useManageChirp();
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

  const onSubmit = ({ content }: Inputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    createChirp(
      { content, parentChirpId: replyToId },
      {
        onSuccess: (newChirpId) => {
          reset();
          closeCreateChirpModal();
          toast.success(
            <div className={styles.toast}>
              <div className={styles.message}>Your chirp was created!</div>
              <Link className={styles.link} to={`/chirps/${newChirpId}`}>
                View
              </Link>
            </div>,
          );
        },
        onError: (error) => {
          toast.error(getRequestErrorMessage(error));
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
        <Link to={`/users/${currentUser?.username}`}>
          <img
            src={currentUser?.profile.picture ?? defaultAvatar}
            alt={`${currentUser?.username}'s  avatar`}
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
            disabled={Boolean(isCreatingChirp)}
            placeholder={replyToId ? 'Chirp your reply' : "What's happening?"}
            className={styles.contentInput}
            aria-invalid={errors.content ? 'true' : 'false'}
            {...rest}
          />

          {isCreatingChirp ? (
            <Loader />
          ) : (
            <Button
              type='submit'
              className={styles.submitButton}
              disabled={!isDirty || !isValid}
            >
              {replyToId ? 'Reply' : 'Chirp'}
            </Button>
          )}
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
