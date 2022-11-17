import { privateClient, publicClient } from '../client';
import { User } from '../../interfaces/User';

const getOne = async (username: string) => {
  const params = {
    userFields: 'username, profile, metrics, createdAt',
  };

  const { data } = await publicClient.get<{ data: User }>(
    `/users/${username}`,
    { params },
  );

  return data;
};

const getManyLiking = async (id: string) => {
  const params = {
    userFields: 'username, profile',
  };

  const { data } = await publicClient.get<{ data: User[] }>(
    `/chirps/${id}/liking-users`,
    { params },
  );

  return data;
};

const getManyFollowed = async (username: string) => {
  const params = {
    userFields: 'username, profile',
  };

  const { data } = await publicClient.get<{ data: User[] }>(
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

  const { data } = await publicClient.get<{ data: User[] }>(
    `/users/${username}/following`,
    { params },
  );

  return data;
};

const getCurrentOne = async (signal?: AbortSignal): Promise<User> => {
  const params = {
    userFields: 'username, profile, metrics, createdAt',
  };

  const { data } = await privateClient.get<{ data: User }>('/me', {
    params,
    signal,
  });

  return data.data;
};

const updateProfile = async (
  profile: User['profile'],
): Promise<User['profile']> => {
  const { data } = await privateClient.put<{ data: User['profile'] }>(
    '/me/profile',
    profile,
  );

  return data.data;
};

const updateUsername = async (
  newUsername: User['username'],
  password: string,
): Promise<User['username']> => {
  const { data } = await privateClient.put<{ data: User['username'] }>(
    '/me/username',
    { newUsername, password },
  );

  return data.data;
};

const updateEmail = async (
  newEmail: string,
  password: string,
): Promise<string> => {
  const { data } = await privateClient.put<{ data: string }>('/me/email', {
    newEmail,
    password,
  });

  return data.data;
};

const updatePassword = async (password: string, newPassword: string) => {
  await privateClient.put('/me/password', { password, newPassword });
};

const deleteCurrentOne = async (password: string) => {
  await privateClient.delete('/me', { data: { password } });
};

export default {
  getOne,
  getCurrentOne,
  getManyLiking,
  getManyFollowed,
  getManyFollowing,
  updateProfile,
  updateUsername,
  updateEmail,
  updatePassword,
  deleteCurrentOne,
};
