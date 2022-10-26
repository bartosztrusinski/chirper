import client from '../client';
import Chirp from '../../interfaces/Chirp';

const getMany = async (ids?: string[]) => {
  const params: Record<string, unknown> = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  // if (ids?.length === 0) return { data: [] };

  if (ids) params.ids = ids;

  const { data } = await client.get<{ data: Chirp[] }>('/chirps', { params });
  return data;
};

const getOne = async (id: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  const { data } = await client.get<{ data: Chirp }>(`/chirps/${id}`, {
    params,
  });
  return data;
};

export default {
  getMany,
  getOne,
};
