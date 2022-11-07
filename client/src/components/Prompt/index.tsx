import styles from './styles.module.scss';
import Button from '../Button';
import { CSSProperties } from 'react';
import { IconType } from '@react-icons/all-files';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';

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
  return (
    <>
      <Icon className={styles.icon} style={{ color: iconColor }} />
      <div className={styles.textContainer}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.buttons}>
        <Button variant='primary'>Log In</Button>
        <Button variant='light'>Sign Up</Button>
      </div>
    </>
  );
};

export default Prompt;
