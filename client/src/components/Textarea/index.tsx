import styles from './styles.module.scss';
import { forwardRef } from 'react';
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize';

interface TextareaProps extends TextareaAutosizeProps {
  placeholder: string;
  placeholderClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { placeholder, placeholderClassName, className, ...restProps },
    ref,
  ) {
    const labelClasses = [styles.textareaContainer, className]
      .filter(Boolean)
      .join(' ');
    const placeholderClasses = [styles.placeholder, placeholderClassName]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={labelClasses}>
        <TextareaAutosize
          {...restProps}
          ref={ref}
          placeholder=''
          className={styles.textarea}
        />
        <div className={placeholderClasses}>{placeholder}</div>
      </label>
    );
  },
);

export default Textarea;
