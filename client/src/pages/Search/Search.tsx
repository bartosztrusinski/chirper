import Container from '../../components/ui/Container';
import Heading from '../../components/ui/Heading';
import MutedText from '../../components/ui/MutedText';
import { LocationGenerics, SearchParams } from '../../interface';
import { SearchChirps } from '../../features/chirps';
import { useEffect } from 'react';
import { useSearch } from '@tanstack/react-location';

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

  useEffect(() => {
    document.title = 'Search';
  }, []);

  return searchParams.query ? (
    <SearchChirps searchParams={searchParams} />
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
