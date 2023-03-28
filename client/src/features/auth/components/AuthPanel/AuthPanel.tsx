import styles from './AuthPanel.module.scss';
import Button from '../../../../components/ui/Button';
import { useModal } from '../../../../context/ModalContext';

const AuthPanel = () => {
  const modal = useModal();

  return (
    <div className={styles.buttonContainer}>
      <Button variant='light' onClick={() => modal.openSignUp()}>
        Sign up
      </Button>
      <Button variant='light' onClick={() => modal.openLogIn()}>
        Log in
      </Button>
    </div>
  );
};

export default AuthPanel;
