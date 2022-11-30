import { createContext, useState } from 'react';
import useMultiStep from '../../hooks/useMultiStep';
import Modal from '../Modal';
import ReactModal from 'react-modal';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

type RegisterFormProps = ReactModal.Props;

export const MultiStepContext = createContext<{
  currentStepIndex: number;
  step: React.ReactNode;
  steps: React.ReactNode[];
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => void;
  back: () => void;
} | null>(null);

export interface FormData {
  email: string;
  name: string;
  verificationCode: string;
  generatedVerificationCode: string;
  password: string;
  passwordConfirm: string;
  username: string;
}

const RegisterForm = ({ isOpen, onRequestClose }: RegisterFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    generatedVerificationCode: (
      Math.floor(Math.random() * 900000) + 100000
    ).toString(),
    verificationCode: '',
    password: '',
    passwordConfirm: '',
    username: '',
  });

  const clearFormData = () => {
    setFormData({
      email: '',
      name: '',
      verificationCode: '',
      generatedVerificationCode: '',
      password: '',
      passwordConfirm: '',
      username: '',
    });
  };

  const handleSubmit = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));

    if (isLastStep) {
      console.table(formData);
      // registerUser(formValues);
      //navigate({to: `/users/${formValues.username}`});
      //clearFormData();
    }

    next();
  };

  const { currentStepIndex, step, steps, isFirstStep, isLastStep, next, back } =
    useMultiStep([
      <Step1 key={1} data={formData} onSubmit={handleSubmit} />,
      <Step2 key={2} data={formData} onSubmit={handleSubmit} />,
      <Step3 key={3} data={formData} onSubmit={handleSubmit} />,
      <Step4 key={4} data={formData} onSubmit={handleSubmit} />,
      //<Navigate key={5} to={`/users/${formValues.username}`} />,
    ]);

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
