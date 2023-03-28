import styles from './Toggle.module.scss';
import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';

interface ToggleProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  toggleSize?: 'small' | 'medium' | 'large';
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, toggleSize = 'medium', checked, onChange, ...restProps },
  ref,
) {
  const [isChecked, setIsChecked] = useState<boolean>(Boolean(checked));
  const classes = [
    styles.toggle,
    isChecked && styles.enabled,
    styles[toggleSize],
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    setIsChecked(e.target.checked);
  };

  return (
    <label className={classes}>
      <span className='visually-hidden'>
        {`${isChecked ? 'Disable' : 'Enable'} ${label}`}
      </span>
      <input
        {...restProps}
        ref={ref}
        type='checkbox'
        className={styles.input}
        onChange={handleChange}
      />
    </label>
  );
});

export default Toggle;
