import chirpKeys from '../queryKeys';
import { Chirp, ChirpsResponse } from '../interface';
import { SearchParams } from '../../../interface';
import { User, useCurrentUser } from '../../users';
import {
  fetchChirp,
  fetchChirps,
  fetchFeedChirps,
  fetchLikedChirpIds,
  fetchLikedChirps,
  fetchReplyChirps,
  fetchSearchChirps,
  fetchUserChirps,
  fetchUserChirpsWithReplies,
} from '../api';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

type UseChirpsQuery = (
  queryFn: (sinceId?: Chirp['_id']) => Promise<ChirpsResponse>,
  queryKeys: readonly unknown[],
) => UseChirpsQueryResult;

type UseChirpsQueryResult = UseInfiniteQueryResult<ChirpsResponse>;

type UseChirpQuery = (chirpId: Chirp['_id']) => UseQueryResult<Chirp>;

const useChirpQuery: UseChirpQuery = (chirpId) => {
  const { currentUser } = useCurrentUser();

  return useQuery({
    queryKey: chirpKeys.detail(chirpId),
    queryFn: async () => {
      const chirp = await fetchChirp(chirpId);

      if (!currentUser) {
        return chirp;
      }

      const likedChirpIds = await fetchLikedChirpIds(currentUser.username, [
        chirp._id,
      ]);

      return { ...chirp, isLiked: likedChirpIds.includes(chirp._id) };
    },
    retry: false,
  });
};

const useChirpsQuery: UseChirpsQuery = (queryFn, queryKeys) => {
  const { currentUser } = useCurrentUser();

  return useInfiniteQuery(
    queryKeys,
    async ({ pageParam }) => {
      const { data, ...rest } = await queryFn(pageParam);

      if (!currentUser || data.length === 0) {
        return { data, ...rest };
      }

      const likedChirpIds = await fetchLikedChirpIds(
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
};

const useReplyChirpsQuery = (chirpId: Chirp['_id']): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchReplyChirps(chirpId, sinceId),
    chirpKeys.list('replies', chirpId),
  );

const useUserChirpsQuery = (username: User['username']): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchUserChirps(username, sinceId),
    chirpKeys.list('noReplies', username),
  );

const useUserChirpsWithRepliesQuery = (
  username: User['username'],
): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchUserChirpsWithReplies(username, sinceId),
    chirpKeys.list('withReplies', username),
  );

const useUserLikedChirpsQuery = (
  username: User['username'],
): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchLikedChirps(username, sinceId),
    chirpKeys.list('liked', username),
  );

const useAllChirpsQuery = (): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchChirps(sinceId),
    chirpKeys.list('all'),
  );

const useFeedChirpsQuery = (username: User['username']): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchFeedChirps(username, sinceId),
    chirpKeys.list('feed', username),
  );

const useSearchChirpsQuery = (
  searchParams: Partial<SearchParams>,
): UseChirpsQueryResult =>
  useChirpsQuery(
    (sinceId?: Chirp['_id']) => fetchSearchChirps(searchParams, sinceId),
    chirpKeys.list('search', searchParams),
  );

export {
  useChirpQuery,
  useAllChirpsQuery,
  useFeedChirpsQuery,
  useReplyChirpsQuery,
  useSearchChirpsQuery,
  useUserChirpsQuery,
  useUserChirpsWithRepliesQuery,
  useUserLikedChirpsQuery,
};
