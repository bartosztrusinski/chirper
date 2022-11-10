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

const getManyLiking = async (id: string) => {
  const params = {
    userFields: 'username, profile',
  };

  const { data } = await client.get<{ data: User[] }>(
    `/chirps/${id}/liking-users`,
    { params },
  );

  return data;
};

const getManyFollowed = async (username: string) => {
  const params = {
    userFields: 'username, profile',
  };

  const { data } = await client.get<{ data: User[] }>(
    `/users/${username}/followed`,
    {
      params,
    },
  );

  return data;
};

const getManyFollowing = async (username: string) => {
  const params = {
    userFields: 'username, profile',
  };

  const { data } = await client.get<{ data: User[] }>(
    `/users/${username}/following`,
    { params },
  );

  return data;
};

export default {
  getOne,
  getManyLiking,
  getManyFollowed,
  getManyFollowing,
};
