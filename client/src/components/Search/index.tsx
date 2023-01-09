import ChirpService from '../../api/services/Chirp';
import { MakeGenerics, useSearch } from '@tanstack/react-location';
import Container from '../Container';
import Heading from '../Heading';
import MutedText from '../MutedText';
import ChirpList from '../ChirpList';

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

  const queryKeys = ['search', searchParams];

  return searchParams.query ? (
    <section>
      <h1 className='visually-hidden'>Search Timeline</h1>
      <ChirpList
        queryKeys={queryKeys}
        queryFn={(sinceId?: string) =>
          ChirpService.searchChirps(searchParams as SearchParams, sinceId)
        }
      />
    </section>
  ) : (
    <Container>
      <Heading size='small'>What&apos;s on your mind? 💭</Heading>
      <MutedText>
        Search for Chirps by typing something in search bar above
      </MutedText>
    </Container>
  );
};

export default Search;
