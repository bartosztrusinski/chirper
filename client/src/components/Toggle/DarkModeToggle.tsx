import styles from './styles.module.scss';
import useDarkMode from '../../hooks/useDarkMode';
import { FiMoon } from '@react-icons/all-files/fi/FiMoon';
import { FiSun } from '@react-icons/all-files/fi/FiSun';

interface Props {
  name?: string;
}

const Toggle = ({ name = 'darkMode' }: Props) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <label
      htmlFor={`${name}Toggle`}
      className={`${styles.toggle} ${isDarkMode ? styles.enabled : ''}`}
    >
      <div className={styles.icons}>
        <FiSun className={styles.icon} />
        <FiMoon className={styles.icon} />
      </div>
      <span className='visually-hidden'>
        {isDarkMode ? `Disable ${name}` : `Enable ${name}`}
      </span>
      <input
        type='checkbox'
        id={`${name}Toggle`}
        className={styles.input}
        checked={isDarkMode}
        onChange={() => toggleDarkMode()}
      />
    </label>
  );
};

export default Toggle;
