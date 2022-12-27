import { createContext, useState } from 'react';
import useMultiStep, { MultiStep } from '../../hooks/useMultiStep';
import Modal from '../Modal';
import ReactModal from 'react-modal';
import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';
import UsernameForm from './UsernameForm';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from '@tanstack/react-location';
import { toast } from 'react-hot-toast';
import getRequestErrorMessage from '../../utils/getResponseErrorMessage';

interface RegisterFormData {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  username: string;
}

type RegisterFormProps = ReactModal.Props;

const MultiStepContext = createContext<MultiStep | null>(null);

const multiStepElements = [EmailForm, PasswordForm, UsernameForm];

const defaultFormData: RegisterFormData = {
  email: '',
  name: '',
  password: '',
  passwordConfirm: '',
  username: '',
};

const RegisterForm = (props: RegisterFormProps) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>(defaultFormData);

  const clearFormData = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = (inputs: Partial<RegisterFormData>) => {
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
