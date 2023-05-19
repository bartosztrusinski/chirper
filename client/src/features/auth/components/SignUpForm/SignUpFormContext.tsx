import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';
import UsernameForm from './UsernameForm';
import { SignUpFormData } from '../../interface';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface SignUpFormContext {
  steps: ReactNode[];
  currentStepIndex: number;
  currentStep: ReactNode;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  resetSteps: () => void;
  formData: SignUpFormData;
  setFormData: Dispatch<SetStateAction<SignUpFormData>>;
  clearFormData: () => void;
}

const defaultFormData: SignUpFormData = {
  email: '',
  name: '',
  password: '',
  passwordConfirm: '',
  username: '',
};

const SignUpFormContext = createContext<SignUpFormContext | null>(null);

const useSignUpForm = (): SignUpFormContext => {
  const singUpFormContext = useContext(SignUpFormContext);

  if (!singUpFormContext) {
    throw new Error(
      'useSignUpForm must be used within a SignUpFormProvider component',
    );
  }
  return singUpFormContext;
};

interface SignUpFormProviderProps {
  children: ReactNode;
}

const steps = [
  <EmailForm key={0} />,
  <PasswordForm key={1} />,
  <UsernameForm key={2} />,
];

const SignUpFormProvider = ({ children }: SignUpFormProviderProps) => {
  const [formData, setFormData] = useState<SignUpFormData>(defaultFormData);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const firstStepIndex = 0;
  const lastStepIndex = steps.length - 1;

  const nextStep = () => {
    if (currentStepIndex < lastStepIndex) {
      setCurrentStepIndex((prevStep) => prevStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > firstStepIndex) {
      setCurrentStepIndex((prevStep) => prevStep - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStepIndex(firstStepIndex);
  };

  const clearFormData = () => {
    setFormData(defaultFormData);
  };

  return (
    <SignUpFormContext.Provider
      value={{
        steps,
        currentStepIndex,
        currentStep: steps[currentStepIndex],
        isFirstStep: currentStepIndex === firstStepIndex,
        isLastStep: currentStepIndex === lastStepIndex,
        nextStep,
        previousStep,
        resetSteps,
        formData,
        setFormData,
        clearFormData,
      }}
    >
      {children}
    </SignUpFormContext.Provider>
  );
};

export default SignUpFormProvider;
export { useSignUpForm };
