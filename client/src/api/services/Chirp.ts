import client from '../client';

const getMany = async () => {
  const response = await client.get('/chirps', {
    params: {
      expandAuthor: true,
      userFields: 'username, profile',
      chirpFields: 'content, createdAt, metrics, replies',
    },
  });
  return response.data;
};

export default {
  getMany,
};
