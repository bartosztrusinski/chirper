import styles from './EditProfileModal.module.scss';
import Modal, { ModalProps } from '../../../../components/ui/Modal';
import Heading from '../../../../components/ui/Heading';
import Input from '../../../../components/form/Input';
import Textarea from '../../../../components/form/Textarea';
import Loader from '../../../../components/ui/Loader';
import Button from '../../../../components/ui/Button';
import useCurrentUser from '../../hooks/useCurrentUser';
import useManageUser from '../../hooks/useManageUser';
import getRequestErrorMessage from '../../../../utils/getResponseErrorMessage';
import filterObject from '../../../../utils/filterObject';
import userKeys from '../../queryKeys';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-location';
import { toast } from 'react-hot-toast';
import { useIsMutating } from '@tanstack/react-query';
import { name, bio, location, website } from '../../schema';

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({
  name,
  bio,
  location,
  website,
});

const EditProfileModal = (props: ModalProps) => {
  const { currentUser } = useCurrentUser();
  const { updateProfile } = useManageUser();
  const navigate = useNavigate();
  const isUpdatingProfile = useIsMutating(userKeys.update());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(inputsSchema),
    defaultValues: { ...currentUser?.profile },
  });

  const onSubmit = (inputs: Inputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const filteredInputs = filterObject(
      inputs,
      (input) => input.length > 0,
    ) as Inputs;

    updateProfile(filteredInputs, {
      onSuccess: (updatedProfile) => {
        reset({ ...updatedProfile });
        navigate({ to: '.' });
        toast.success('Profile updated!');
      },
      onError: (error) => {
        toast.error(getRequestErrorMessage(error));
      },
    });
  };

  return (
    <Modal
      {...props}
      header={
        <Heading size='medium'>
          <h1>Edit profile</h1>
        </Heading>
      }
      onAfterClose={reset}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            autoFocus
            placeholder='Name'
            className={errors.name && styles.invalidInput}
            placeholderClassName={errors.name && styles.placeholder}
            aria-invalid={errors.name ? 'true' : 'false'}
            {...register('name')}
          />

          {errors.name && (
            <p role='alert' className={styles.errorMessage}>
              {errors.name?.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            placeholder='Bio'
            className={errors.bio && styles.invalidInput}
            placeholderClassName={errors.bio && styles.placeholder}
            aria-invalid={errors.bio ? 'true' : 'false'}
            {...register('bio')}
          />

          {errors.bio && (
            <p role='alert' className={styles.errorMessage}>
              {errors.bio?.message}
            </p>
          )}
        </div>

        <div>
          <Input
            placeholder='Location'
            className={errors.location && styles.invalidInput}
            placeholderClassName={errors.location && styles.placeholder}
            aria-invalid={errors.location ? 'true' : 'false'}
            {...register('location')}
          />

          {errors.location && (
            <p role='alert' className={styles.errorMessage}>
              {errors.location?.message}
            </p>
          )}
        </div>

        <div>
          <Input
            placeholder='Website'
            className={errors.website && styles.invalidInput}
            placeholderClassName={errors.website && styles.placeholder}
            aria-invalid={errors.website ? 'true' : 'false'}
            {...register('website')}
          />

          {errors.website && (
            <p role='alert' className={styles.errorMessage}>
              {errors.website?.message}
            </p>
          )}
        </div>

        {isUpdatingProfile ? (
          <Loader />
        ) : (
          <Button
            type='submit'
            disabled={!isValid}
            className={styles.submitButton}
          >
            Save
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default EditProfileModal;
