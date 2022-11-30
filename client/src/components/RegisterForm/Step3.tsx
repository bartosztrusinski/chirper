import styles from './styles.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { passwordConfirm, password } from './schemas';
import Form from './Form';
import { FormData } from '.';
import PasswordInput from '../PasswordInput';

type Inputs = Pick<FormData, 'password' | 'passwordConfirm'>;

const schema = z
  .object({
    password,
    passwordConfirm,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
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
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    },
  });

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      isInvalid={Boolean(
        errors.password ||
          errors.passwordConfirm ||
          getValues('password') === '' ||
          getValues('passwordConfirm') === '',
      )}
    >
      <div className={styles.heading}>You&apos;ll need a password</div>
      <PasswordInput autoFocus {...register('password')} />
      <div className={styles.description}>{errors.password?.message}</div>
      <PasswordInput
        placeholder='Confirm password'
        {...register('passwordConfirm')}
      />
      <div className={styles.description}>
        {errors.passwordConfirm?.message}
      </div>
      <div className={styles.description}>
        Password must be at least 8 characters long and contain:
        <ul style={{ listStylePosition: 'inside' }}>
          <li>uppercase letter</li>
          <li>lowercase letter</li>
          <li>number</li>
        </ul>
      </div>
      <div>{JSON.stringify(watch())}</div>
    </Form>
  );
};

export default Step1;
