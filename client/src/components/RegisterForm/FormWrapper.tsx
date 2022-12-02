import { ComponentPropsWithoutRef, useContext } from 'react';
import styles from './styles.module.scss';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import Button from '../Button';
import { Link } from '@tanstack/react-location';
import { MultiStepContext } from '.';

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
  const { previousStep, currentStepIndex, isFirstStep, isLastStep, steps } =
    useContext(MultiStepContext);

  return (
    <form {...restProps} className={styles.form}>
      <div className={styles.stepContainer}>
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
        {children}
      </div>
      <Button
        type='submit'
        disabled={isInvalid || isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting
          ? 'Signing Up...'
          : isLastStep
          ? 'Create Account'
          : 'Next'}
      </Button>
      {isFirstStep && (
        <p className={styles.logInLink}>
          Have an account already?
          <Link to={location.pathname} search={{ login: true }}>
            Log In
          </Link>
        </p>
      )}
    </form>
  );
};

export default FormWrapper;
