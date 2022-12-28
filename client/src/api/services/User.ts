import axios from 'axios';
import { privateClient, publicClient } from '../client';
import { Token, User } from '../../interfaces/User';

interface UsersResponse {
  data: User[];
  meta?: {
    nextPage?: string;
  };
}

const getOne = async (username: string) => {
  const params = {
    userFields: 'username, profile, metrics, createdAt',
  };

  const { data } = await publicClient.get<{ data: User }>(
    `/users/${username}`,
    { params },
  );

  return data.data;
};

const getManyLiking = async (chirpId: string, sinceId?: string) => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/chirps/${chirpId}/liking-users`,
    { params },
  );

  return data;
};

const getManyFollowed = async (username: string, sinceId?: string) => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/followed`,
    {
      params,
    },
  );

  return data;
};

const getManyFollowing = async (username: string, sinceId?: string) => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/following`,
    { params },
  );

  return data;
};

const getCurrentOne = async (
  token: Token,
  signal?: AbortSignal,
): Promise<User> => {
  const params = { userFields: 'username, profile, metrics, createdAt' };
  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await publicClient.get<{ data: User }>('/me', {
    params,
    signal,
    headers,
  });

  return data.data;
};

const getFollowedUsernames = async (
  username: string,
  userIds?: string[],
): Promise<string[]> => {
  const params = { userIds };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/followed`,
    { params },
  );

  return data.data.map((user) => user.username);
};

const followUser = async (username: string) => {
  await privateClient.post(`/me/followed`, { username });
};

const unfollowUser = async (username: string) => {
  await privateClient.delete(`/me/followed/${username}`);
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

const isEmailTaken = async (email: string) => {
  try {
    await publicClient.head('/users', { params: { email } });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};

const isUsernameTaken = async (username: string) => {
  try {
    await publicClient.head('/users', { params: { username } });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};

export default {
  getOne,
  getCurrentOne,
  getManyLiking,
  getManyFollowed,
  getManyFollowing,
  isEmailTaken,
  isUsernameTaken,
  getFollowedUsernames,
  followUser,
  unfollowUser,
  updateProfile,
  updateUsername,
  updateEmail,
  updatePassword,
  deleteCurrentOne,
};
