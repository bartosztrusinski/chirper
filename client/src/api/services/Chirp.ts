import { publicClient } from '../client';
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

  return data;
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

  return data;
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

  return data;
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

  return data;
};

export default {
  getMany,
  getOne,
  getManyByUser,
  getManyLikedByUser,
  getUserTimeline,
};
