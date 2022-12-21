import { ComponentPropsWithoutRef, useContext } from 'react';
import styles from './styles.module.scss';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import Button from '../Button';
import { MultiStepContext } from '.';
import { MultiStep } from '../../hooks/useMultiStep';
import { PromptContext } from '../UnauthenticatedApp';
import Loader from '../Loader';

interface FormWrapperProps extends ComponentPropsWithoutRef<'form'> {
  isInvalid?: boolean;
  isSubmitting?: boolean;
}

const FormWrapper = ({
  children,
  isInvalid = false,
  isSubmitting = false,
  ...restProps
}: FormWrapperProps) => {
  const { LogInLink: LoginLink } = useContext(PromptContext) as PromptContext;
  const { previousStep, currentStepIndex, isFirstStep, isLastStep, steps } =
    useContext(MultiStepContext) as MultiStep;

  return (
    <>
      <div className={styles.stepIndexPanel}>
        {!isFirstStep && (
          <button
            type='button'
            onClick={previousStep}
            className={styles.backButton}
          >
            <FaArrowLeft />
          </button>
        )}
        Step {currentStepIndex + 1} of {steps.length}
      </div>

      <form {...restProps} className={styles.form}>
        <div className={styles.stepContainer}>{children}</div>

        {isSubmitting ? (
          <Loader />
        ) : (
          <Button type='submit' disabled={isInvalid}>
            {isLastStep ? 'Create Account' : 'Next'}
          </Button>
        )}
      </form>

      {isFirstStep && (
        <p className={styles.logInLink}>
          Have an account already? <LoginLink>Log In</LoginLink>
        </p>
      )}
    </>
  );
};

export default FormWrapper;
