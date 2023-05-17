import { publicClient } from '../../apiClient';
import { User, UsersResponse } from './interface';

const fetchUser = async (username: string) => {
  const params = {
    userFields: 'username, profile, metrics, createdAt',
  };

  const { data } = await publicClient.get<{ data: User }>(
    `/users/${username}`,
    { params },
  );

  return data.data;
};

const fetchLikingUsers = async (chirpId: string, sinceId?: string) => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/chirps/${chirpId}/liking-users`,
    { params },
  );

  return data;
};

const fetchFollowedUsers = async (username: string, sinceId?: string) => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/followed`,
    {
      params,
    },
  );

  return data;
};

const fetchFollowingUsers = async (username: string, sinceId?: string) => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/following`,
    { params },
  );

  return data;
};

const fetchFollowedUsernames = async (
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

export {
  fetchUser,
  fetchLikingUsers,
  fetchFollowedUsers,
  fetchFollowingUsers,
  fetchFollowedUsernames,
};
