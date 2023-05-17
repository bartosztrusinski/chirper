import ChirpList from '../ChirpList';
import { useSearchChirpsQuery } from '../../hooks/useChirpsQuery';
import { SearchParams } from '../../../../interface';
import chirpKeys from '../../queryKeys';

interface SearchChirpsProps {
  searchParams: Partial<SearchParams>;
}

const SearchChirps = ({ searchParams }: SearchChirpsProps) => {
  return (
    <section>
      <h1 className='visually-hidden'>Search Timeline</h1>
      <ChirpList
        queryKeys={chirpKeys.list('search', searchParams)}
        queryData={useSearchChirpsQuery(searchParams)}
      />
    </section>
  );
};

export default SearchChirps;
