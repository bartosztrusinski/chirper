import styles from './styles.module.scss';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaFilter } from '@react-icons/all-files/fa/FaFilter';
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import useDebounce from '../../hooks/useDebounce';
import {
  MakeGenerics,
  useLocation,
  useMatchRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';

type SearchParams = {
  query: string;
  sortOrder?: 'relevant' | 'recent' | 'popular';
  from?: string;
  includeReplies?: boolean;
  followedOnly?: boolean;
  startTime?: string;
  endTime?: string;
};

const SearchForm = () => {
  const navigate = useNavigate();
  const search = useSearch<MakeGenerics<{ Search: SearchParams }>>();
  const matchRoute = useMatchRoute();
  const location = useLocation();

  const isSearchRoute = matchRoute({ to: '/search', fuzzy: true });

  const [query, setQuery] = useState<string>(search.query ?? '');
  const debouncedQuery = useDebounce(query, 200);

  // sync query params with user input
  useEffect(() => {
    if (location.current.pathname === '/search') {
      navigate({
        search: (old) => ({ ...old, query: debouncedQuery || undefined }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // if user navigates to search page, sync query params with user input
  useEffect(() => {
    if (location.current.pathname === '/search' && query && !search.query) {
      navigate({ search: (old) => ({ ...old, query }) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.current.pathname, search.query]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    navigate({ to: '/search', search: (old) => ({ ...old, query }) });
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate({ to: '/search/advanced', search: true });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type='search'
        placeholder='Search Chirper'
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isSearchRoute && (
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
    </form>
  );
};

export default SearchForm;
