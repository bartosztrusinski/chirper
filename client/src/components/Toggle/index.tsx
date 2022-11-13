import styles from './styles.module.scss';
import useToggle from '../../hooks/useToggle';

interface Props {
  name: string;
}

const Toggle = ({ name }: Props) => {
  const [isEnabled, toggleIsEnabled] = useToggle();

  return (
    <label className={`${styles.toggle} ${isEnabled ? styles.enabled : ''}`}>
      <span className='visually-hidden'>
        {isEnabled ? `Disable ${name}` : `Enable ${name}`}
      </span>
      <input
        type='checkbox'
        className={styles.input}
        checked={isEnabled}
        onChange={() => toggleIsEnabled()}
      />
    </label>
  );
};

export default Toggle;
