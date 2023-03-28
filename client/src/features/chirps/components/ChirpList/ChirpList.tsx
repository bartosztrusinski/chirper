import Chirp from '../Chirp';
import Button from '../../../../components/ui/Button';
import Container from '../../../../components/ui/Container';
import Heading from '../../../../components/ui/Heading';
import Loader from '../../../../components/ui/Loader';
import MutedText from '../../../../components/ui/MutedText';
import useInfiniteQueryObserver from '../../../../hooks/useInfiniteQueryObserver';
import { UseInfiniteQueryResult, useQueryClient } from '@tanstack/react-query';
import { ChirpsResponse } from '../../interface';

interface ChirpListProps {
  queryData: UseInfiniteQueryResult<ChirpsResponse>;
  queryKeys: readonly unknown[];
}

const ChirpList = ({ queryData, queryKeys }: ChirpListProps) => {
  const queryClient = useQueryClient();
  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    queryData;
  const lastChirpRef = useInfiniteQueryObserver(
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  );

  if (data) {
    const chirps = data.pages.flatMap((page) => page.data);

    if (chirps.length === 0) {
      return (
        <Container>
          <Heading size='small'>No Chirps found 👀</Heading>
          <MutedText>Sorry! There are no Chirps here</MutedText>
        </Container>
      );
    }

    return (
      <>
        {chirps.map((chirp, index) => (
          <Container key={chirp._id}>
            <Chirp
              ref={index === chirps.length - 1 ? lastChirpRef : null}
              chirp={chirp}
              queryKeys={queryKeys}
            />
          </Container>
        ))}
        {hasNextPage ? (
          <div style={{ minHeight: '2.5rem' }}>
            {isFetchingNextPage && <Loader />}
          </div>
        ) : (
          <Container>
            <Heading size='small'>🚧 End of the road 🚧</Heading>
            <MutedText>
              You&apos;ve reached the end! That&apos;s all Chirps we&apos;ve got
            </MutedText>
          </Container>
        )}
      </>
    );
  }

  if (isError) {
    return (
      <Container>
        <Heading size='small'>
          Oops... looks like we couldn&apos;t get Chirps 😬
        </Heading>
        <MutedText>
          Try clicking the button below or refreshing the page
        </MutedText>
        <Button
          style={{ marginTop: '0.75rem' }}
          onClick={() =>
            queryClient.refetchQueries(queryKeys, {
              exact: true,
            })
          }
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Loader />
    </Container>
  );
};

export default ChirpList;
