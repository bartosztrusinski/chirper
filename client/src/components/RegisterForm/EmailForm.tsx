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
      <div className={styles.heading}>Create your account</div>

      <Input placeholder='Email' autoFocus {...register('email')} />
      <div className={styles.description}>{errors.email?.message}</div>

      <Input placeholder='Name' type='text' {...register('name')} />
      <div className={styles.description}>{errors.name?.message}</div>
    </FormWrapper>
  );
};

export default EmailForm;
