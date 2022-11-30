import styles from './styles.module.scss';
import Input from '../Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { username } from './schemas';
import Form from './Form';
import { FormData } from '.';

type Inputs = Pick<FormData, 'username'>;

const schema = z.object({
  username,
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
      username: data.username,
    },
  });

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      isInvalid={Boolean(errors.username || getValues('username') === '')}
    >
      <div className={styles.heading}>What should we call you?</div>
      <div className={styles.description}>
        Your @username is unique. You can always change it later
      </div>
      <Input placeholder='Username' autoFocus {...register('username')} />
      <div className={styles.description}>{errors.username?.message}</div>
    </Form>
  );
};

export default Step1;
