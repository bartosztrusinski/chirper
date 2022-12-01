import styles from './styles.module.scss';
import FormWrapper from './FormWrapper';
import Input from '../Input';
import { FormData } from '.';
import { verificationCode } from './schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface VerificationCodeFormProps {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
}

type Inputs = z.infer<typeof inputsSchema>;

const inputsSchema = z
  .object({
    verificationCode,
    generatedVerificationCode: z.string(),
  })
  .refine((data) => data.verificationCode === data.generatedVerificationCode, {
    message: 'Invalid verification code',
    path: ['verificationCode'],
  });

const VerificationCodeForm = ({
  formData,
  onSubmit,
}: VerificationCodeFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(inputsSchema),
    defaultValues: {
      verificationCode: formData.verificationCode,
      generatedVerificationCode: formData.generatedVerificationCode,
    },
  });

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isInvalid={false}>
      <div>
        <div className={styles.heading}>We sent you a code</div>
        <div className={styles.description}>
          Enter it below to verify {formData.email}
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
    </FormWrapper>
  );
};

export default VerificationCodeForm;
