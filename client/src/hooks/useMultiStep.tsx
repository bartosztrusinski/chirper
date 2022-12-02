import { ReactNode, useState } from 'react';

interface UseMultiStep {
  steps: ReactNode[];
  currentStepIndex: number;
  currentStep: ReactNode;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  resetSteps: () => void;
}

const useMultiStep = (steps: ReactNode[]): UseMultiStep => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    isFirstStep: currentStepIndex === firstStepIndex,
    isLastStep: currentStepIndex === lastStepIndex,
    nextStep,
    previousStep,
    resetSteps,
  };
};

export default useMultiStep;
export { UseMultiStep };
