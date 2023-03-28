import { useModal } from '../../../context/ModalContext';
import Button from '../Button';
import styles from './Prompt.module.scss';

interface PromptProps {
  title: string;
  description: string;
}

const Prompt = ({ title, description }: PromptProps) => {
  const modal = useModal();

  return (
    <>
      <div className={styles.content}>
        <div className={styles.heading}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>

      <div className={styles.buttons}>
        <Button
          autoFocus
          onClick={() => {
            modal.close();
            modal.openLogIn();
          }}
        >
          Log In
        </Button>
        <Button
          variant='light'
          onClick={() => {
            modal.close();
            modal.openSignUp();
          }}
        >
          Sign Up
        </Button>
      </div>
    </>
  );
};

export default Prompt;
