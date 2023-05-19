import styles from './SignUp.module.scss';
import FormWrapper from './FormWrapper';
import Heading from '../../../../components/ui/Heading';
import MutedText from '../../../../components/ui/MutedText';
import Input from '../../../../components/form/Input';
import getRequestErrorMessage from '../../../../utils/getResponseErrorMessage';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { username } from '../../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchIsUsernameTaken } from '../../api';
import { useSignUpForm } from './SignUpFormContext';
import { useNavigate } from '@tanstack/react-location';
import useAuth from '../../hooks/useAuth';

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({ username });

const UsernameForm = () => {
  const { formData, resetSteps, clearFormData } = useSignUpForm();
  const { signUp } = useAuth();
  const navigate = useNavigate();
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

  const onSubmit = async (inputs: Inputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    try {
      const isUsernameTaken = await fetchIsUsernameTaken(inputs.username);

      if (isUsernameTaken) {
        setError('username', {
          type: 'manual',
          message: 'Username is already taken',
        });
        return;
      }

      signUp(
        { ...formData, ...inputs },
        {
          onSuccess: () => {
            navigate({ to: '/' });
            toast.success('Welcome to Chirper!');
          },
          onError: (error) => {
            toast.error(getRequestErrorMessage(error));
          },
          onSettled: () => {
            clearFormData();
            resetSteps();
          },
        },
      );
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isInvalid={!isValid}>
      <div>
        <Heading size='large'>
          <h1>What should we call you?</h1>
        </Heading>
        <MutedText>
          Your @username is unique. You should choose it wisely as you&apos;ll
          be stuck with it
        </MutedText>
      </div>
      <div className={styles.inputGroup}>
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
      </div>
    </FormWrapper>
  );
};

export default UsernameForm;
