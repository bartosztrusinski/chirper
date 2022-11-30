import styles from './styles.module.scss';
import Input from '../Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { email, name } from './schemas';
import Form from './Form';
import { FormData } from '.';

type Inputs = Pick<FormData, 'email' | 'name'>;

const schema = z.object({
  email,
  name,
});

interface Props {
  onSubmit: (data: Partial<FormData>) => void;
  data: FormData;
}

const Step1 = ({ data, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: data.email,
      name: data.name,
    },
  });

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      isInvalid={Boolean(
        errors.email ||
          errors.name ||
          getValues('email') === '' ||
          getValues('name') === '',
      )}
    >
      <div className={styles.heading}>Create your account</div>

      <Input placeholder='Email' autoFocus {...register('email')} />
      <div className={styles.description}>{errors.email?.message}</div>

      <Input placeholder='Name' type='text' {...register('name')} />
      <div className={styles.description}>{errors.name?.message}</div>
    </Form>
  );
};

export default Step1;
