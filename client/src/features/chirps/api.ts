import { User } from '../users';
import { privateClient, publicClient } from '../../apiClient';
import { Chirp, ChirpsResponse } from './interface';
import { SearchParams } from '../../interface';

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
  searchParams: Partial<SearchParams>,
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

export {
  fetchChirps,
  fetchChirp,
  fetchReplyChirps,
  fetchUserChirps,
  fetchUserChirpsWithReplies,
  fetchLikedChirps,
  fetchFeedChirps,
  fetchSearchChirps,
  fetchLikedChirpIds,
};
