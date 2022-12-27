import { privateClient, publicClient } from '../client';
import Chirp from '../../interfaces/Chirp';
import { User } from '../../interfaces/User';

interface ChirpsResponse {
  data: Chirp[];
  meta?: {
    nextPage?: string;
  };
}

const getMany = async (sinceId?: string) => {
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

const getOne = async (id: string) => {
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

const getReplies = async (chirpId: string, sinceId?: string) => {
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

const getManyByUser = async (
  username: string,
  sinceId?: string,
  includeReplies = false,
) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    sinceId,
    includeReplies,
  };

  const { data } = await publicClient.get<ChirpsResponse>(
    `/users/${username}/chirps`,
    { params },
  );

  return data;
};

const getManyLikedByUser = async (username: string, sinceId?: string) => {
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

const getUserTimeline = async (username: string, sinceId?: string) => {
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

const likeChirp = async (chirpId: string) => {
  await privateClient.post(`/me/likes`, { chirpId });
};

const unlikeChirp = async (chirpId: string) => {
  await privateClient.delete(`/me/likes/${chirpId}`);
};

const getLikedChirpIds = async (
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

const createChirp = async (
  content: Chirp['content'],
  parentChirpId?: Chirp['_id'],
): Promise<Chirp['_id']> => {
  const { data } = await privateClient.post<{ data: Chirp['_id'] }>('/chirps', {
    content,
    parentId: parentChirpId,
  });

  return data.data;
};

const deleteChirp = async (chirpId: string) => {
  await privateClient.delete(`/chirps/${chirpId}`);
};

type SearchParams = {
  query: string;
  sortOrder?: 'relevant' | 'recent' | 'popular';
  from?: string;
  includeReplies?: boolean;
  followedOnly?: boolean;
  startTime?: string;
  endTime?: string;
};

const searchChirps = async (searchParams: SearchParams, nextPage?: string) => {
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

export default {
  getMany,
  getOne,
  getReplies,
  getManyByUser,
  getManyLikedByUser,
  getUserTimeline,
  likeChirp,
  unlikeChirp,
  getLikedChirpIds,
  createChirp,
  deleteChirp,
  searchChirps,
};
