import SearchChirps from '../SearchChirps';
import { MakeGenerics, useSearch } from '@tanstack/react-location';

type SearchParams = {
  query: string;
  sortOrder?: 'relevant' | 'recent' | 'popular';
  from?: string;
  includeReplies?: boolean;
  followedOnly?: boolean;
  startTime?: string;
  endTime?: string;
};

type LocationGenerics = MakeGenerics<{
  Search: SearchParams & { dialog?: 'advanced-search' };
}>;

const Search = () => {
  const search = useSearch<LocationGenerics>();

  return search.query ? (
    <SearchChirps searchParams={search as SearchParams} />
  ) : (
    <div>Search for something</div>
  );
};

export default Search;
