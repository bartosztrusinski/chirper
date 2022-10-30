import styles from './styles.module.scss';
import useToggle from '../../hooks/useToggle';

interface Props {
  name: string;
}

const Toggle = ({ name }: Props) => {
  const [isEnabled, toggleIsEnabled] = useToggle();

  return (
    <label
      htmlFor={`${name}Toggle`}
      className={`${styles.toggle} ${isEnabled ? styles.enabled : ''}`}
    >
      <span className='visually-hidden'>
        {isEnabled ? `Enable ${name}` : `Disable ${name}`}
      </span>
      <input
        type='checkbox'
        id={`${name}Toggle`}
        className={styles.input}
        checked={isEnabled}
        onChange={() => toggleIsEnabled()}
      />
    </label>
  );
};

export default Toggle;
