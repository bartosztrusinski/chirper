import styles from './ThemeToggle.module.scss';
import { useTheme } from '../../../context/ThemeContext';
import { FiSun as SunIcon } from '@react-icons/all-files/fi/FiSun';
import { FiMoon as MoonIcon } from '@react-icons/all-files/fi/FiMoon';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const classes = [
    styles.toggle,
    styles.darkMode,
    isDarkMode ? styles.enabled : '',
  ].join(' ');

  return (
    <label className={classes}>
      <div className={styles.icons}>
        <SunIcon className={styles.icon} />
        <MoonIcon className={styles.icon} />
      </div>
      <span className='visually-hidden'>
        {isDarkMode ? 'Disable dark mode' : 'Enable dark mode'}
      </span>
      <input
        type='checkbox'
        className={styles.input}
        checked={isDarkMode}
        onChange={() => toggleDarkMode()}
      />
    </label>
  );
};

export default ThemeToggle;
