import styles from './styles.module.scss';
import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';

interface ToggleProps extends ComponentPropsWithoutRef<'input'> {
  title: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { title, defaultChecked, ...restProps },
  ref,
) {
  const [isEnabled, setIsEnabled] = useState<boolean>(defaultChecked ?? false);

  return (
    <label className={`${styles.toggle} ${isEnabled ? styles.enabled : ''}`}>
      <span className='visually-hidden'>
        {isEnabled ? `Disable ${title}` : `Enable ${title}`}
      </span>
      <input
        ref={ref}
        type='checkbox'
        className={styles.input}
        {...restProps}
        onChange={(e) => {
          restProps.onChange?.(e);
          setIsEnabled(e.target.checked);
        }}
      />
    </label>
  );
});

export default Toggle;
