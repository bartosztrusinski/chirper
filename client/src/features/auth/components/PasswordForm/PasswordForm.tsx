import styles from './PasswordForm.module.scss';
import FormWrapper from '../FormWrapper';
import Heading from '../../../../components/ui/Heading';
import PasswordInput from '../../../../components/form/PasswordInput';
import * as z from 'zod';
import { password, passwordConfirm } from '../../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData } from '../../interface';

interface PasswordFormProps {
  formData: RegisterFormData;
  onSubmit: (data: Partial<RegisterFormData>) => void;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z
  .object({ password, passwordConfirm })
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
      <Heading size='large'>
        <h1>You&apos;ll need a password</h1>
      </Heading>

      <div className={styles.inputGroup}>
        <div>
          <PasswordInput
            autoFocus
            className={errors.password && styles.invalidInput}
            placeholderClassName={errors.password && styles.placeholder}
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password')}
          />

          {errors.password && (
            <p role='alert' className={styles.errorMessage}>
              {errors.password?.message}
            </p>
          )}
        </div>

        <div>
          <PasswordInput
            placeholder='Confirm password'
            className={errors.passwordConfirm && styles.invalidInput}
            placeholderClassName={errors.passwordConfirm && styles.placeholder}
            aria-invalid={errors.passwordConfirm ? 'true' : 'false'}
            {...register('passwordConfirm')}
          />

          {errors.passwordConfirm && (
            <p role='alert' className={styles.errorMessage}>
              {errors.passwordConfirm?.message}
            </p>
          )}
        </div>
      </div>
    </FormWrapper>
  );
};

export default PasswordForm;
