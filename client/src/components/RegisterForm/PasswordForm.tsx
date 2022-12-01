import styles from './styles.module.scss';
import FormWrapper from './FormWrapper';
import PasswordInput from '../PasswordInput';
import { FormData } from '.';
import { passwordConfirm, password } from './schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface PasswordFormProps {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z
  .object({
    password,
    passwordConfirm,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

const PasswordForm = ({ formData, onSubmit }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(inputsSchema),
    defaultValues: {
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    },
  });

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isInvalid={!isValid}>
      <div className={styles.heading}>You&apos;ll need a password</div>

      <PasswordInput autoFocus {...register('password')} />
      <div className={styles.description}>{errors.password?.message}</div>

      <PasswordInput
        placeholder='Confirm password'
        {...register('passwordConfirm')}
      />
      <div className={styles.description}>
        {errors.passwordConfirm?.message}
      </div>
    </FormWrapper>
  );
};

export default PasswordForm;
