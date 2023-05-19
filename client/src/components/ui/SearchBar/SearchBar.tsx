import styles from './SearchBar.module.scss';
import SearchOptionsModal from '../SearchOptionsModal';
import useDebounce from '../../../hooks/useDebounce';
import { LocationGenerics } from '../../../interface';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaFilter } from '@react-icons/all-files/fa/FaFilter';
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-location';

const SearchBar = () => {
  const navigate = useNavigate<LocationGenerics>();
  const search = useSearch<LocationGenerics>();
  const location = useLocation<LocationGenerics>();

  const [query, setQuery] = useState<string>(search.query ?? '');
  const debouncedQuery = useDebounce(query, 200);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState<boolean>(
    search.dialog === 'advanced-search',
  );

  useEffect(() => {
    setIsAdvancedSearchOpen(search.dialog === 'advanced-search');
  }, [search.dialog]);
  const isSearchPage = location.current.pathname === '/search';

  // sync query params with user input
  useEffect(() => {
    if (isSearchPage) {
      navigate({
        search: (old) => ({ ...old, query: debouncedQuery || undefined }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // if user navigates to search page, sync query params with user input
  useEffect(() => {
    if (isSearchPage && query.length && !search.query) {
      navigate({ search: (old) => ({ ...old, query }) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchPage]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    navigate({ to: '/search', search: (old) => ({ ...old, query }) });
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate({
      search: (old) => ({ ...old, dialog: 'advanced-search' }),
      replace: true,
    });
  };

  const handleModalClose = () =>
    navigate({
      search: (old) => ({ ...old, dialog: undefined }),
      replace: true,
    });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type='search'
        placeholder='Search Chirper'
        className={styles.input}
        enterKeyHint='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isSearchPage && (
        <button type='button' className={styles.button} onClick={handleClick}>
          <FaFilter />
        </button>
      )}

      <button
        type='submit'
        disabled={query.length === 0}
        className={styles.button}
      >
        <FaSearch />
      </button>

      <SearchOptionsModal
        isOpen={isAdvancedSearchOpen && isSearchPage}
        onRequestClose={handleModalClose}
      />
    </form>
  );
};

export default SearchBar;
