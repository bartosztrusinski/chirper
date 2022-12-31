import styles from './styles.module.scss';
import Button from '../Button';
import { useContext } from 'react';
import { PromptContext } from '../UnauthenticatedApp';

interface PromptProps {
  title: string;
  description: string;
}

const Prompt = ({ title, description }: PromptProps) => {
  const promptContext = useContext(PromptContext);

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
            promptContext?.openLogIn();
            promptContext?.closePrompt();
          }}
        >
          Log In
        </Button>
        <Button
          variant='light'
          onClick={() => {
            promptContext?.openSignUp();
            promptContext?.closePrompt();
          }}
        >
          Sign Up
        </Button>
      </div>
    </>
  );
};

export default Prompt;
