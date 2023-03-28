import { Chirp, ChirpsResponse } from '../interface';
import { SearchParams } from '../../../interface';
import { useCurrentUser, User } from '../../users';
import { privateClient, publicClient } from '../../../apiClient';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import chirpKeys from '../queryKeys';

const fetchChirps = async (sinceId?: string) => {
  const params: Record<string, unknown> = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
  };

  const { data } = await publicClient.get<ChirpsResponse>('/chirps', {
    params,
  });

  return data;
};

const fetchChirp = async (id: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  const { data } = await publicClient.get<{ data: Chirp }>(`/chirps/${id}`, {
    params,
  });

  return data.data;
};

const fetchReplyChirps = async (chirpId: string, sinceId?: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/chirps/${chirpId}/replies`,
    { params },
  );

  return data;
};

const fetchUserChirps = async (username: string, sinceId?: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/users/${username}/chirps`,
    { params },
  );

  return data;
};

const fetchUserChirpsWithReplies = async (
  username: string,
  sinceId?: string,
) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
    includeReplies: true,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/users/${username}/chirps`,
    { params },
  );

  return data;
};

const fetchLikedChirps = async (username: string, sinceId?: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/users/${username}/liked-chirps`,
    { params },
  );

  return data;
};

const fetchFeedChirps = async (username: string, sinceId?: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/users/${username}/timelines/reverse-chronological`,
    { params },
  );

  return data;
};

const fetchSearchChirps = async (
  searchParams: SearchParams,
  nextPage?: string,
) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    ...searchParams,
    page: nextPage,
  };

  const { data } = await privateClient.get<ChirpsResponse>('/chirps/search', {
    params,
  });

  return data;
};

const fetchLikedChirpIds = async (
  username: User['username'],
  chirpIds?: Chirp['_id'][],
): Promise<Chirp['_id'][]> => {
  const params = {
    chirpIds,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/users/${username}/liked-chirps`,
    { params },
  );

  return data.data.map((chirp) => chirp._id);
};

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
  searchParams: SearchParams,
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
