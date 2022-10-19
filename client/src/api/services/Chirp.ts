import client from '../client';

const getMany = async () => {
  const response = await client.get('/chirps');
  return response.data;
};

export default {
  getMany,
};
