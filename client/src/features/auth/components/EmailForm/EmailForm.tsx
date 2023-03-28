import styles from './EmailForm.module.scss';
import FormWrapper from '../FormWrapper';
import Heading from '../../../../components/ui/Heading';
import Input from '../../../../components/form/Input';
import getRequestErrorMessage from '../../../../utils/getResponseErrorMessage';
import axios from 'axios';
import * as z from 'zod';
import { publicClient } from '../../../../apiClient';
import { email, name } from '../../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { RegisterFormData } from '../../interface';

interface EmailFormProps {
  formData: RegisterFormData;
  onSubmit: (data: Partial<RegisterFormData>) => void;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({ email, name });

const fetchIsEmailTaken = async (email: string) => {
  try {
    await publicClient.head('/users', { params: { email } });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};

const EmailForm = ({ formData, onSubmit }: EmailFormProps) => {
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

  const onEmailSubmit = async (inputs: Inputs) => {
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
        onSubmit(inputs);
      }
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onEmailSubmit)} isInvalid={!isValid}>
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
