import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import styles from './styles.module.scss';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  placeholder: string;
  placeholderClassName?: string;
  button?: ReactNode;
  onButtonClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    placeholder,
    className,
    placeholderClassName,
    button,
    onButtonClick,
    ...restProps
  },
  ref,
) {
  const labelClasses = [styles.inputContainer, className]
    .filter(Boolean)
    .join(' ');
  const placeholderClasses = [styles.placeholder, placeholderClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={labelClasses}>
      <input
        ref={ref}
        type='text'
        className={styles.input}
        placeholder=' '
        enterKeyHint='done'
        {...restProps}
      />
      <div className={placeholderClasses}>{placeholder}</div>
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
});

export default Input;
