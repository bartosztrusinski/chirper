import styles from './SignUp.module.scss';
import FormWrapper from './FormWrapper';
import Heading from '../../../../components/ui/Heading';
import PasswordInput from '../../../../components/form/PasswordInput';
import * as z from 'zod';
import { password, passwordConfirm } from '../../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpFormData } from '../../interface';
import { useSignUpForm } from './SignUpFormContext';

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z
  .object({ password, passwordConfirm })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

const PasswordForm = () => {
  const { formData, setFormData, nextStep } = useSignUpForm();
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

  const onSubmit = (inputs: Partial<SignUpFormData>) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setFormData((prev) => ({ ...prev, ...inputs }));
    nextStep();
  };

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
