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

interface Inputs {
  login: string;
  password: string;
}

const LoginForm = () => {
  const { logIn, isLoggingIn } = useAuth();
  const { SignUpLink } = useContext(PromptContext) as PromptContext;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = (inputs: Inputs) => {
    logIn(inputs, {
      onSuccess: () => {
        navigate({ to: '/' });
      },
      onError: (error) => {
        console.log(error, 'invalid credentials');
      },
    });
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h3 className={styles.heading}>Sign in to Chirper</h3>

        <div>
          <Input
            autoFocus
            placeholder='Username or email'
            className={errors.login && styles.invalidInput}
            placeholderClassName={errors.login && styles.placeholder}
            aria-invalid={errors.login ? 'true' : 'false'}
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
            className={errors.password && styles.invalidInput}
            placeholderClassName={errors.password && styles.placeholder}
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password', { required: 'Please enter password' })}
          />

          {errors.password && (
            <p role='alert' className={styles.errorMessage}>
              {errors.password.message}
            </p>
          )}
        </div>

        {isLoggingIn ? (
          <Loader />
        ) : (
          <Button type='submit' disabled={!isValid}>
            Log In
          </Button>
        )}
      </form>

      <p className={styles.signUpLink}>
        Don&apos;t have an account? <SignUpLink>Sign Up</SignUpLink>
      </p>
    </>
  );
};

export default LoginForm;
