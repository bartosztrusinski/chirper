import styles from './styles.module.scss';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaFilter } from '@react-icons/all-files/fa/FaFilter';

function SearchForm() {
  return (
    <>
      <form className={styles.form}>
        <input type='search' className={styles.input} placeholder='Search...' />
        <button type='button' className={styles.button}>
          <FaFilter />
        </button>
        <button type='submit' className={styles.button}>
          <FaSearch />
        </button>
      </form>
    </>
  );
}

export default SearchForm;
