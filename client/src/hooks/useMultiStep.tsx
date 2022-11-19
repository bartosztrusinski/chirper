import { ReactNode, useState } from 'react';

const useMultiStep = (steps: ReactNode[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const firstStepIndex = 0;
  const lastStepIndex = steps.length - 1;

  const next = () => {
    if (currentStepIndex < lastStepIndex) {
      setCurrentStepIndex((prevStep) => prevStep + 1);
    }
  };

  const back = () => {
    if (currentStepIndex > firstStepIndex) {
      setCurrentStepIndex((prevStep) => prevStep - 1);
    }
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    next,
    back,
    steps,
    isFirstStep: currentStepIndex === firstStepIndex,
    isLastStep: currentStepIndex === lastStepIndex,
  };
};

export default useMultiStep;
