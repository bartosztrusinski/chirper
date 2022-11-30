import styles from './styles.module.scss';
import Input from '../Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verificationCode } from './schemas';
import Form from './Form';
import { FormData } from '.';

type Inputs = Pick<FormData, 'verificationCode' | 'generatedVerificationCode'>;

const schema = z
  .object({
    verificationCode,
    generatedVerificationCode: z.string(),
  })
  .refine((data) => data.verificationCode === data.generatedVerificationCode, {
    message: 'Invalid verification code',
    path: ['verificationCode'],
  });

interface Props {
  onSubmit: (data: Partial<FormData>) => void;
  data: FormData;
}

const Step1 = ({ data, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: {
      verificationCode: data.verificationCode,
      generatedVerificationCode: data.generatedVerificationCode,
    },
  });

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      isInvalid={Boolean(getValues('verificationCode') === '')}
    >
      <div>
        <div className={styles.heading}>We sent you a code</div>
        <div className={styles.description}>
          Enter it below to verify {data.email}
        </div>
      </div>
      <Input
        placeholder='Verification code'
        autoFocus
        {...register('verificationCode')}
      />
      <div className={styles.description}>
        {errors.verificationCode?.message}
      </div>
      <div>{JSON.stringify(watch())}</div>
    </Form>
  );
};

export default Step1;
