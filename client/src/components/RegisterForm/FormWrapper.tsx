import styles from './styles.module.scss';
import Button from '../Button';
import Loader from '../Loader';
import { ComponentPropsWithoutRef, useContext } from 'react';
import { MultiStepContext } from '.';
import { PromptContext } from '../UnauthenticatedApp';
import { MultiStep } from '../../hooks/useMultiStep';
import { useIsMutating } from '@tanstack/react-query';

interface FormWrapperProps extends ComponentPropsWithoutRef<'form'> {
  isInvalid?: boolean;
}

const FormWrapper = ({
  children,
  isInvalid = false,
  ...restProps
}: FormWrapperProps) => {
  const isSigningUp = useIsMutating(['user', 'auth']);
  const { LogInLink } = useContext(PromptContext) as PromptContext;
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
