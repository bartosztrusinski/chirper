import { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props extends ComponentPropsWithoutRef<'input'> {
  placeholder: string;
  button?: ReactNode;
  onButtonClick?: () => void;
}

const Input = ({ placeholder, button, onButtonClick, ...restProps }: Props) => {
  return (
    <label className={styles.inputContainer}>
      <input
        type='text'
        className={styles.input}
        placeholder=''
        {...restProps}
      />
      <div className={styles.placeholder}>{placeholder}</div>
      {button && (
        <button
          type='button'
          className={styles.inputButton}
          onClick={onButtonClick}
        >
          {button}
        </button>
      )}
    </label>
  );
};

export default Input;
