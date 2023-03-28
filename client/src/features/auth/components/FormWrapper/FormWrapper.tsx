import styles from './FormWrapper.module.scss';
import Loader from '../../../../components/ui/Loader';
import Button from '../../../../components/ui/Button';
import { MultiStepContext } from '../RegisterForm';
import { useModal } from '../../../../context/ModalContext';
import { MultiStep } from '../../hooks/useMultiStep';
import { ComponentPropsWithoutRef, useContext } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import authKeys from '../../queryKeys';

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
  const { isFirstStep, isLastStep } = useContext(MultiStepContext) as MultiStep;

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
