import styles from './styles.module.scss';
import Input from '../Input';
import PasswordInput from '../PasswordInput';
import Button from '../Button';
import { useNavigate } from '@tanstack/react-location';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { PromptContext } from '../UnauthenticatedApp';
import Loader from '../Loader';
import toast from 'react-hot-toast';
import getRequestErrorMessage from '../../utils/getResponseErrorMessage';
import { useIsMutating } from '@tanstack/react-query';

interface LogInInputs {
  login: string;
  password: string;
}

const LogInForm = () => {
  const navigate = useNavigate();
  const isLoggingIn = useIsMutating(['user', 'auth']);
  const { SignUpLink } = useContext(PromptContext) as PromptContext;
  const { logIn } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LogInInputs>({
    mode: 'onChange',
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = (inputs: LogInInputs) => {
    logIn(inputs, {
      onSuccess: () => {
        navigate({ to: '/' });
        toast.success('Welcome back!');
      },
      onError: (error) => {
        reset();
        toast.error(getRequestErrorMessage(error));
      },
    });
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h3 className={styles.heading}>Sign in to Chirper</h3>
        <div className={styles.inputGroup}>
          <div>
            <Input
              autoFocus
              placeholder='Username or email'
              placeholderClassName={errors.login && styles.placeholder}
              aria-invalid={errors.login ? 'true' : 'false'}
              className={errors.login && styles.invalidInput}
              {...register('login', {
                required: 'Please enter username or email',
              })}
            />

            {errors.login && (
              <p role='alert' className={styles.errorMessage}>
                {errors.login.message}
              </p>
            )}
          </div>

          <div>
            <PasswordInput
              placeholderClassName={errors.password && styles.placeholder}
              aria-invalid={errors.password ? 'true' : 'false'}
              className={errors.password && styles.invalidInput}
              {...register('password', { required: 'Please enter password' })}
            />

            {errors.password && (
              <p role='alert' className={styles.errorMessage}>
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {isLoggingIn ? (
          <Loader />
        ) : (
          <Button type='submit' disabled={!isValid}>
            Log In
          </Button>
        )}
      </form>
      <div className={styles.signUpLink}>
        Don&apos;t have an account? <SignUpLink>Sign Up</SignUpLink>
      </div>
    </>
  );
};

export default LogInForm;
