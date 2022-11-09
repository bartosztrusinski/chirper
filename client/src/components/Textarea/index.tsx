import { ComponentPropsWithoutRef, useRef } from 'react';
import useAutosizeTextArea from '../../hooks/useAutosizeTextarea';
import styles from './styles.module.scss';

interface Props extends ComponentPropsWithoutRef<'textarea'> {
  placeholder: string;
}

const Textarea = ({ placeholder, ...restProps }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textareaRef.current, restProps.value as string);

  return (
    <label className={styles.textareaContainer}>
      <textarea
        {...restProps}
        ref={textareaRef}
        placeholder=''
        className={styles.textarea}
        rows={1}
      />
      <div className={styles.placeholder}>{placeholder}</div>
    </label>
  );
};

export default Textarea;
