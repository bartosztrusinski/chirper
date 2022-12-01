import { createContext, useState } from 'react';
import useMultiStep from '../../hooks/useMultiStep';
import Modal from '../Modal';
import ReactModal from 'react-modal';
import EmailForm from './EmailForm';
import VerificationCodeForm from './VerificationCodeForm';
import PasswordForm from './PasswordForm';
import UsernameForm from './UsernameForm';

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

const MultiStepContext = createContext<{
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  step: React.ReactNode;
  steps: React.ReactNode[];
  next: () => void;
  back: () => void;
}>({
  currentStepIndex: 0,
  isFirstStep: false,
  isLastStep: false,
  step: null,
  steps: [],
  next: () => null,
  back: () => null,
});

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
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());

  const clearFormData = () => {
    setFormData(getDefaultFormData());
  };

  const handleSubmit = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));

    if (isFirstStep) {
      // Send verification code to email
    }

    if (isLastStep) {
      console.table(formData);
      // registerUser(formValues);
      //clearFormData();
      //navigate({to: `/users/${formValues.username}`});
    }

    next();
  };

  const { currentStepIndex, step, steps, isFirstStep, isLastStep, next, back } =
    useMultiStep(
      multiStepElements.map((Step, index) => (
        <Step key={index} formData={formData} onSubmit={handleSubmit} />
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
          step,
          steps,
          isFirstStep,
          isLastStep,
          next,
          back,
        }}
      >
        {step}
      </MultiStepContext.Provider>
    </Modal>
  );
};

export default RegisterForm;
export { FormData, MultiStepContext };
