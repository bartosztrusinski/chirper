import styles from './SignUp.module.scss';
import Loader from '../../../../components/ui/Loader';
import Button from '../../../../components/ui/Button';
import authKeys from '../../queryKeys';
import { useModal } from '../../../../context/ModalContext';
import { ComponentPropsWithoutRef } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { useSignUpForm } from './SignUpFormContext';

interface FormWrapperProps extends ComponentPropsWithoutRef<'form'> {
  isInvalid?: boolean;
}

const FormWrapper = ({
  children,
  isInvalid = false,
  ...restProps
}: FormWrapperProps) => {
  const isSigningUp = useIsMutating(authKeys.update('signUp'));
  const { LogInLink } = useModal();
  const { isFirstStep, isLastStep } = useSignUpForm();

  return (
    <>
      <form {...restProps} className={styles.form}>
        {children}

        {isSigningUp ? (
          <Loader />
        ) : (
          <Button type='submit' disabled={isInvalid}>
            {isLastStep ? 'Create Account' : 'Next'}
          </Button>
        )}
      </form>

      {isFirstStep && (
        <div className={styles.logInLink}>
          Have an account already? <LogInLink>Log In</LogInLink>
        </div>
      )}
    </>
  );
};

export default FormWrapper;
