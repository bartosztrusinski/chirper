import { User } from '../users';
import { privateClient, publicClient } from '../../apiClient';
import { Chirp, ChirpsResponse, CreateChirp } from './interface';
import { SearchParams } from '../../interface';

const fetchChirps = async (sinceId?: Chirp['_id']): Promise<ChirpsResponse> => {
  const params = {
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

const fetchChirp = async (chirpId: Chirp['_id']): Promise<Chirp> => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  const { data } = await publicClient.get<{ data: Chirp }>(
    `/chirps/${chirpId}`,
    {
      params,
    },
  );

  return data.data;
};

const fetchReplyChirps = async (
  chirpId: Chirp['_id'],
  sinceId?: Chirp['_id'],
): Promise<ChirpsResponse> => {
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

const fetchUserChirps = async (
  username: User['username'],
  sinceId?: Chirp['_id'],
): Promise<ChirpsResponse> => {
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
  username: User['username'],
  sinceId?: Chirp['_id'],
): Promise<ChirpsResponse> => {
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

const fetchLikedChirps = async (
  username: User['_id'],
  sinceId?: Chirp['_id'],
): Promise<ChirpsResponse> => {
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

const fetchFeedChirps = async (
  username: User['_id'],
  sinceId?: Chirp['_id'],
): Promise<ChirpsResponse> => {
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
): Promise<ChirpsResponse> => {
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

const fetchLikeChirp = async (chirp: Chirp): Promise<void> => {
  await privateClient.post(`/me/likes`, { chirpId: chirp._id });
};

const fetchUnlikeChirp = async (chirp: Chirp): Promise<void> => {
  await privateClient.delete(`/me/likes/${chirp._id}`);
};

const fetchCreateChirp = async ({
  content,
  parentChirpId,
}: CreateChirp): Promise<Chirp['_id']> => {
  const { data } = await privateClient.post<{ data: Chirp['_id'] }>('/chirps', {
    content,
    parentId: parentChirpId,
  });

  return data.data;
};

const fetchDeleteChirp = async (chirpId: Chirp['_id']): Promise<void> => {
  await privateClient.delete(`/chirps/${chirpId}`);
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
  fetchLikeChirp,
  fetchUnlikeChirp,
  fetchCreateChirp,
  fetchDeleteChirp,
};
