import styles from './styles.module.scss';
import FormWrapper from './FormWrapper';
import Input from '../Input';
import UserService from '../../api/services/User';
import { FormData } from '.';
import { username } from './schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface UsernameFormProps {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
  isSubmitting: boolean;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({
  username,
});

const UsernameForm = ({
  formData,
  onSubmit,
  isSubmitting,
}: UsernameFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(inputsSchema),
    defaultValues: {
      username: formData.username,
    },
  });

  const onUsernameSubmit = async (inputs: Inputs) => {
    try {
      const isUsernameTaken = await UserService.isUsernameTaken(
        inputs.username,
      );

      if (isUsernameTaken) {
        setError('username', {
          type: 'manual',
          message: 'Username is already taken',
        });
      } else {
        onSubmit(inputs);
      }
    } catch {
      console.log('error checking username');
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit(onUsernameSubmit)}
      isInvalid={!isValid}
      isSubmitting={isSubmitting}
    >
      <div>
        <h3 className={styles.heading}>What should we call you?</h3>
        <p className={styles.description}>
          Your @username is unique. You can always change it later
        </p>
      </div>

      <div>
        <Input
          autoFocus
          placeholder='Username'
          className={errors.username && styles.invalidInput}
          placeholderClassName={errors.username && styles.placeholder}
          aria-invalid={errors.username ? 'true' : 'false'}
          {...register('username')}
        />

        {errors.username && (
          <p role='alert' className={styles.errorMessage}>
            {errors.username?.message}
          </p>
        )}
      </div>
    </FormWrapper>
  );
};

export default UsernameForm;