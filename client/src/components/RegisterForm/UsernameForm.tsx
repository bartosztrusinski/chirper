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
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({
  username,
});

const UsernameForm = ({ formData, onSubmit }: UsernameFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<Inputs>({
    mode: 'onTouched',
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
    <FormWrapper onSubmit={handleSubmit(onUsernameSubmit)} isInvalid={!isValid}>
      <div>
        <div className={styles.heading}>What should we call you?</div>
        <div className={styles.description}>
          Your @username is unique. You can always change it later
        </div>
      </div>

      <Input placeholder='Username' autoFocus {...register('username')} />
      <div className={styles.description}>{errors.username?.message}</div>
    </FormWrapper>
  );
};

export default UsernameForm;
