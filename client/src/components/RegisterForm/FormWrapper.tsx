import { ComponentPropsWithoutRef, useContext } from 'react';
import styles from './styles.module.scss';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import Button from '../Button';
import { Link } from '@tanstack/react-location';
import { MultiStepContext } from '.';

interface FormWrapperProps extends ComponentPropsWithoutRef<'form'> {
  isInvalid?: boolean;
}

const FormWrapper = ({
  children,
  isInvalid = false,
  ...restProps
}: FormWrapperProps) => {
  const context = useContext(MultiStepContext);
  const { back, currentStepIndex, isFirstStep, isLastStep, steps } = context;

  return (
    <form {...restProps} className={styles.form}>
      <div className={styles.stepContainer}>
        <div className={styles.stepIndexPanel}>
          {!isFirstStep && (
            <button type='button' onClick={back} className={styles.backButton}>
              <FaArrowLeft />
            </button>
          )}
          Step {currentStepIndex + 1} of {steps.length}
        </div>
        {children}
      </div>
      <Button
        type='submit'
        disabled={isInvalid}
        className={styles.submitButton}
      >
        {isLastStep ? 'Create Account' : 'Next'}
      </Button>
      {isFirstStep && (
        <div className={styles.logInLink}>
          Have an account already? <Link to='?login=true'>Log In</Link>
        </div>
      )}
    </form>
  );
};

export default FormWrapper;
