import client from '../client';
import User from '../../interfaces/User';

const getOne = async (username: string) => {
  const params = {
    userFields: 'username, profile, metrics, createdAt',
  };

  const { data } = await client.get<{ data: User }>(`/users/${username}`, {
    params,
  });
  return data;
};

export default {
  getOne,
};
