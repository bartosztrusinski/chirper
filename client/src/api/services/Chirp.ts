import client from '../client';

const getMany = async (ids?: string[]) => {
  const params: Record<string, unknown> = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };
  if (ids) params.ids = ids;

  const response = await client.get('/chirps', { params });
  return response.data;
};

const getOne = async (id: string) => {
  const params = {
    expandAuthor: true,
    userFields: 'username, profile',
    chirpFields: 'content, createdAt, metrics, replies',
  };

  const response = await client.get(`/chirps/${id}`, { params });
  return response.data;
};

export default {
  getMany,
  getOne,
};
