import chirpKeys from '../queryKeys';
import { Chirp, ChirpsResponse } from '../interface';
import { SearchParams } from '../../../interface';
import { useCurrentUser } from '../../users';
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

type UseChirpsQuery = ({
  queryFn,
  queryKeys,
}: {
  queryFn: (sinceId?: string) => Promise<ChirpsResponse>;
  queryKeys: readonly unknown[];
}) => UseInfiniteQueryResult<ChirpsResponse>;

const useChirpQuery = (chirpId: string): UseQueryResult<Chirp> => {
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

const useChirpsQuery: UseChirpsQuery = ({ queryFn, queryKeys }) => {
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

const useReplyChirpsQuery = (
  chirpId: string,
): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('replies', chirpId),
    queryFn: (sinceId?: string) => fetchReplyChirps(chirpId, sinceId),
  });
};

const useUserChirpsQuery = (
  username: string,
): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('noReplies', username),
    queryFn: (sinceId?: string) => fetchUserChirps(username, sinceId),
  });
};

const useUserChirpsWithRepliesQuery = (
  username: string,
): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('withReplies', username),
    queryFn: (sinceId?: string) =>
      fetchUserChirpsWithReplies(username, sinceId),
  });
};

const useUserLikedChirpsQuery = (
  username: string,
): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('liked', username),
    queryFn: (sinceId?: string) => fetchLikedChirps(username, sinceId),
  });
};

const useAllChirpsQuery = (): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('all'),
    queryFn: (sinceId?: string) => fetchChirps(sinceId),
  });
};

const useFeedChirpsQuery = (
  username: string,
): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('feed', username),
    queryFn: (sinceId?: string) => fetchFeedChirps(username, sinceId),
  });
};

const useSearchChirpsQuery = (
  searchParams: Partial<SearchParams>,
): UseInfiniteQueryResult<ChirpsResponse> => {
  return useChirpsQuery({
    queryKeys: chirpKeys.list('search', searchParams),
    queryFn: (sinceId?: string) => fetchSearchChirps(searchParams, sinceId),
  });
};

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
