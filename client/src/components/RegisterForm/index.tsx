import { createContext, useState } from 'react';
import useMultiStep, { MultiStep } from '../../hooks/useMultiStep';
import Modal from '../Modal';
import ReactModal from 'react-modal';
import EmailForm from './EmailForm';
import VerificationCodeForm from './VerificationCodeForm';
import PasswordForm from './PasswordForm';
import UsernameForm from './UsernameForm';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from '@tanstack/react-location';

interface FormData {
  email: string;
  name: string;
  verificationCode: string;
  generatedVerificationCode: string;
  password: string;
  passwordConfirm: string;
  username: string;
}

type RegisterFormProps = ReactModal.Props;

const MultiStepContext = createContext<MultiStep | null>(null);

const multiStepElements = [
  EmailForm,
  VerificationCodeForm,
  PasswordForm,
  UsernameForm,
];

const getDefaultFormData = (): FormData => ({
  email: '',
  name: '',
  verificationCode: '',
  generatedVerificationCode: generateCode().toString(),
  password: '',
  passwordConfirm: '',
  username: '',
});

const generateCode = () => Math.floor(Math.random() * 900000) + 100000;

const RegisterForm = ({ isOpen, onRequestClose }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { signUp, isSigningUp } = useAuth();
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  const clearFormData = () => {
    setFormData(getDefaultFormData());
  };

  const handleSubmit = (inputs: Partial<FormData>) => {
    if (isFirstStep) {
      // Send verification code to email
      console.log(formData.generatedVerificationCode);
    }

    if (isLastStep) {
      signUp(
        { ...formData, ...inputs },
        {
          onSuccess: () => navigate({ to: '/' }),
          onError: () => {
            clearFormData();
            resetSteps();
          },
        },
      );
    }

    setFormData((prev) => ({ ...prev, ...inputs }));
    nextStep();
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
      <Step
        key={index}
        formData={formData}
        onSubmit={handleSubmit}
        isSubmitting={isSigningUp}
      />
    )),
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
export { FormData, MultiStepContext };
