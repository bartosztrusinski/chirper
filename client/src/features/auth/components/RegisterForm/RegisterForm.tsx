import styles from './RegisterForm.module.scss';
import EmailForm from '../EmailForm';
import PasswordForm from '../PasswordForm';
import UsernameForm from '../UsernameForm';
import useAuth from '../../hooks/useAuth';
import Modal, { ModalProps } from '../../../../components/ui/Modal';
import useMultiStep, { MultiStep } from '../../hooks/useMultiStep';
import getRequestErrorMessage from '../../../../utils/getResponseErrorMessage';
import { CgChevronLeft as LeftArrow } from '@react-icons/all-files/cg/CgChevronLeft';
import { createContext, useState } from 'react';
import { useNavigate } from '@tanstack/react-location';
import { toast } from 'react-hot-toast';
import type { RegisterFormData } from '../../interface';

const MultiStepContext = createContext<MultiStep | null>(null);

const multiStepElements = [EmailForm, PasswordForm, UsernameForm];

const defaultFormData: RegisterFormData = {
  email: '',
  name: '',
  password: '',
  passwordConfirm: '',
  username: '',
};

const RegisterForm = (props: ModalProps) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>(defaultFormData);

  const clearFormData = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = (inputs: Partial<RegisterFormData>) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (isLastStep) {
      signUp(
        { ...formData, ...inputs },
        {
          onSuccess: () => {
            navigate({ to: '/' });
            toast.success('Welcome to Chirper!');
          },
          onError: (error) => {
            clearFormData();
            resetSteps();
            toast.error(getRequestErrorMessage(error));
          },
        },
      );
    } else {
      setFormData((prev) => ({ ...prev, ...inputs }));
      nextStep();
    }
  };

  const {
    currentStepIndex,
    currentStep,
    steps,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    resetSteps,
  } = useMultiStep(
    multiStepElements.map((Step, index) => (
      <Step key={index} formData={formData} onSubmit={handleSubmit} />
    )),
  );

  return (
    <Modal
      {...props}
      onAfterClose={clearFormData}
      shouldCloseOnEsc={isFirstStep}
      shouldCloseOnOverlayClick={isFirstStep}
      hasCloseButton={isFirstStep}
      header={
        <div className={styles.stepIndexPanel}>
          {!isFirstStep && (
            <button
              type='button'
              onClick={previousStep}
              className={styles.backButton}
            >
              <LeftArrow />
            </button>
          )}
          {`Step ${currentStepIndex + 1} of ${steps.length}`}
        </div>
      }
    >
      <MultiStepContext.Provider
        value={{
          currentStepIndex,
          currentStep,
          steps,
          isFirstStep,
          isLastStep,
          nextStep,
          previousStep,
          resetSteps,
        }}
      >
        {currentStep}
      </MultiStepContext.Provider>
    </Modal>
  );
};

export default RegisterForm;
export { RegisterFormData, MultiStepContext };
