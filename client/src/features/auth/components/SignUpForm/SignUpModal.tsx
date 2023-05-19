import styles from './SignUp.module.scss';
import Modal, { ModalProps } from '../../../../components/ui/Modal';
import { CgChevronLeft as LeftArrow } from '@react-icons/all-files/cg/CgChevronLeft';
import { useSignUpForm } from './SignUpFormContext';

const SignUpModal = (props: ModalProps) => {
  const {
    currentStepIndex,
    currentStep,
    isFirstStep,
    clearFormData,
    previousStep,
    steps,
  } = useSignUpForm();

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
      {currentStep}
    </Modal>
  );
};

export default SignUpModal;
