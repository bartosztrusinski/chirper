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

  const searchParams: Partial<SearchParams> = {
    query: search.query,
    sortOrder: search.sortOrder,
    from: search.from,
    includeReplies: search.includeReplies,
    followedOnly: search.followedOnly,
    startTime: search.startTime,
    endTime: search.endTime,
  };

  return searchParams.query ? (
    <SearchChirps searchParams={searchParams as SearchParams} />
  ) : (
    <div>Search for something</div>
  );
};

export default Search;
