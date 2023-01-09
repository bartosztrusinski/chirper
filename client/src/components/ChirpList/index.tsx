import ChirpService from '../../api/services/Chirp';
import useUser from '../../hooks/useUser';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import Loader from '../Loader';
import Chirp from '../Chirp';
import Container from '../Container';
import Heading from '../Heading';
import MutedText from '../MutedText';
import Button from '../Button';

interface ChirpsResponse {
  data: Chirp[];
  meta?: {
    nextPage?: string;
  };
}

interface ChirpListProps {
  queryKeys: unknown[];
  queryFn: (sinceId?: string) => Promise<ChirpsResponse>;
}

const ChirpList = ({ queryKeys, queryFn }: ChirpListProps) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();

  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['chirps', ...queryKeys],
      async ({ pageParam }) => {
        const { data, ...rest } = await queryFn(pageParam);

        if (!currentUser || data.length === 0) {
          return { data, ...rest };
        }

        const likedChirpIds = await ChirpService.getLikedChirpIds(
          currentUser.username,
          data.map((chirp) => chirp._id),
        );

        return {
          data: data.map((chirp) => ({
            ...chirp,
            isLiked: likedChirpIds.includes(chirp._id),
          })),
          ...rest,
        };
      },
      { getNextPageParam: (lastPage) => lastPage.meta?.nextPage },
    );

  const intersectionObserver = useRef<IntersectionObserver>();

  const lastChirpRef = useCallback(
    (chirp: HTMLElement | null) => {
      if (isFetchingNextPage) return;

      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }

      intersectionObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (chirp) {
        intersectionObserver.current.observe(chirp);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
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
        {isFetchingNextPage && <Loader />}
        {!hasNextPage && (
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
            queryClient.refetchQueries(['chirps', ...queryKeys], {
              exact: true,
            })
          }
        >
          Retry
        </Button>
      </Container>
    );
  }

  return <Loader />;
};

export default ChirpList;
