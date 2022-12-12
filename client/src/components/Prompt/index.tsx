import styles from './styles.module.scss';
import Button from '../Button';
import { CSSProperties, useContext } from 'react';
import { IconType } from '@react-icons/all-files';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import { useNavigate } from '@tanstack/react-location';
import { PromptContext } from '../UnauthenticatedApp';

interface Props {
  title: string;
  description: string;
  Icon?: IconType;
  iconColor?: CSSProperties['color'];
}

const Prompt = ({
  title,
  description,
  iconColor,
  Icon = ChirperIcon,
}: Props) => {
  const navigate = useNavigate();
  const promptContext = useContext(PromptContext);

  return (
    <>
      <Icon className={styles.icon} style={{ color: iconColor }} />
      <div className={styles.textContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.buttons}>
        <Button
          autoFocus
          onClick={() => {
            promptContext?.closePrompt();
            navigate({ search: (old) => ({ ...old, login: true }) });
          }}
        >
          Log In
        </Button>
        <Button
          variant='light'
          onClick={() => {
            promptContext?.closePrompt();
            navigate({ search: (old) => ({ ...old, signup: true }) });
          }}
        >
          Sign Up
        </Button>
      </div>
    </>
  );
};

export default Prompt;
