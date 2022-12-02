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
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className={styles.heading}>We sent you a code</h3>
        <p className={styles.description}>
          Enter it below to verify {formData.email}
        </p>
      </div>

      <div>
        <Input
          autoFocus
          placeholder='Verification code'
          className={errors.verificationCode && styles.invalidInput}
          placeholderClassName={errors.verificationCode && styles.placeholder}
          aria-invalid={errors.verificationCode ? 'true' : 'false'}
          {...register('verificationCode')}
        />

        {errors.verificationCode && (
          <p role='alert' className={styles.errorMessage}>
            {errors.verificationCode?.message}
          </p>
        )}
      </div>
    </FormWrapper>
  );
};

export default VerificationCodeForm;
