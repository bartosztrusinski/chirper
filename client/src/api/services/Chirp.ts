import { privateClient, publicClient } from '../client';
import Chirp from '../../interfaces/Chirp';

const getMany = async (ids?: string[]) => {
  const params: Record<string, unknown> = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  // if (ids?.length === 0) return { data: [] };

  if (ids) params.ids = ids;

  const { data } = await publicClient.get<{ data: Chirp[] }>('/chirps', {
    params,
  });

  return data.data;
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

const getManyByUser = async (username: string, includeReplies = false) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
    includeReplies,
  };

  const { data } = await publicClient.get<{ data: Chirp[] }>(
    `/users/${username}/chirps`,
    { params },
  );

  return data.data;
};

const getManyLikedByUser = async (username: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  const { data } = await publicClient.get<{ data: Chirp[] }>(
    `/users/${username}/liked-chirps`,
    { params },
  );

  return data.data;
};

const getUserTimeline = async (username: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  const { data } = await publicClient.get<{ data: Chirp[] }>(
    `/users/${username}/timelines/reverse-chronological`,
    { params },
  );

  return data.data;
};

const likeChirp = async (chirpId: string) => {
  await privateClient.post(`/me/likes`, { chirpId });
};

const unlikeChirp = async (chirpId: string) => {
  await privateClient.delete(`/me/likes/${chirpId}`);
};

const getLikedIds = async (userId: string, ids?: string[]) => {
  const params = {
    user: userId,
    ids,
  };

  const { data } = await publicClient.get<{ data: { chirp: string }[] }>(
    '/likes',
    { params },
  );

  return data.data.map((like) => like.chirp);
};

export default {
  getMany,
  getOne,
  getManyByUser,
  getManyLikedByUser,
  getUserTimeline,
  likeChirp,
  unlikeChirp,
  getLikedIds,
};
