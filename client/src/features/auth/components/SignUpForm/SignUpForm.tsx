import SignUpModal from './SignUpModal';
import SignUpFormProvider from './SignUpFormContext';
import { ModalProps } from '../../../../components/ui/Modal';

const SignUpForm = (props: ModalProps) => {
  return (
    <SignUpFormProvider>
      <SignUpModal {...props} />
    </SignUpFormProvider>
  );
};

export default SignUpForm;
