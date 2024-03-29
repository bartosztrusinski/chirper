import styles from './SignUp.module.scss';
import FormWrapper from './FormWrapper';
import Heading from '../../../../components/ui/Heading';
import Input from '../../../../components/form/Input';
import getRequestErrorMessage from '../../../../utils/getResponseErrorMessage';
import * as z from 'zod';
import { email, name } from '../../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { fetchIsEmailTaken } from '../../api';
import { useSignUpForm } from './SignUpFormContext';

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({ email, name });

const EmailForm = () => {
  const { formData, setFormData, nextStep } = useSignUpForm();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(inputsSchema),
    defaultValues: {
      email: formData.email,
      name: formData.name,
    },
  });

  const onSubmit = async (inputs: Inputs) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    try {
      const isEmailTaken = await fetchIsEmailTaken(inputs.email);

      if (isEmailTaken) {
        setError('email', {
          type: 'manual',
          message: 'Email is already taken',
        });
      } else {
        setFormData((prev) => ({ ...prev, ...inputs }));
        nextStep();
      }
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isInvalid={!isValid}>
      <Heading size='large'>
        <h1>Create your account</h1>
      </Heading>

      <div className={styles.inputGroup}>
        <div>
          <Input
            autoFocus
            type='email'
            placeholder='Email'
            className={errors.email && styles.invalidInput}
            placeholderClassName={errors.email && styles.placeholder}
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email')}
          />

          {errors.email && (
            <p role='alert' className={styles.errorMessage}>
              {errors.email?.message}
            </p>
          )}
        </div>

        <div>
          <Input
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
      </div>
    </FormWrapper>
  );
};

export default EmailForm;
