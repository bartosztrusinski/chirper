import styles from './styles.module.scss';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaFilter } from '@react-icons/all-files/fa/FaFilter';
import { useState } from 'react';
import SearchFilterModal from '../SearchFilterModal';

const SearchForm = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <>
      <form className={styles.form}>
        <input
          type='search'
          className={styles.input}
          placeholder='Search Chirper'
        />
        <button
          type='button'
          className={styles.button}
          onClick={() => setIsFilterOpen(true)}
        >
          <FaFilter />
        </button>
        <button type='submit' className={styles.button}>
          <FaSearch />
        </button>
      </form>
      <SearchFilterModal
        isOpen={isFilterOpen}
        onRequestClose={() => setIsFilterOpen(false)}
      />
    </>
  );
};

export default SearchForm;
