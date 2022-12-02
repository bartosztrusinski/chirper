import styles from './styles.module.scss';
import FormWrapper from './FormWrapper';
import Input from '../Input';
import UserService from '../../api/services/User';
import { FormData } from '.';
import { email, name } from './schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface EmailFormProps {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z.object({
  email,
  name,
});

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
    try {
      const isEmailTaken = await UserService.isEmailTaken(inputs.email);

      if (isEmailTaken) {
        setError('email', {
          type: 'manual',
          message: 'Email is already taken',
        });
      } else {
        onSubmit(inputs);
      }
    } catch {
      console.log('error checking email');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onEmailSubmit)} isInvalid={!isValid}>
      <h3 className={styles.heading}>Create your account</h3>

      <div>
        <Input
          autoFocus
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
    </FormWrapper>
  );
};

export default EmailForm;
