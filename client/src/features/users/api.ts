import { privateClient, publicClient } from '../../apiClient';
import { Token } from '../../interface';
import { Chirp } from '../chirps';
import {
  StoredUser,
  UpdateEmailParams,
  UpdatePasswordParams,
  UpdateUsernameParams,
  User,
  UsersResponse,
} from './interface';

const fetchUser = async (username: User['username']): Promise<User> => {
  const params = {
    userFields: 'username, profile, metrics, createdAt',
  };

  const { data } = await publicClient.get<{ data: User }>(
    `/users/${username}`,
    { params },
  );

  return data.data;
};

const fetchLikingUsers = async (
  chirpId: Chirp['_id'],
  sinceId?: User['_id'],
): Promise<UsersResponse> => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/chirps/${chirpId}/liking-users`,
    { params },
  );

  return data;
};

const fetchFollowedUsers = async (
  username: User['username'],
  sinceId?: User['_id'],
): Promise<UsersResponse> => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/followed`,
    { params },
  );

  return data;
};

const fetchFollowingUsers = async (
  username: User['username'],
  sinceId?: User['_id'],
): Promise<UsersResponse> => {
  const params = { userFields: 'username, profile', sinceId };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/following`,
    { params },
  );

  return data;
};

const fetchFollowedUsernames = async (
  username: User['username'],
  userIds?: User['_id'][],
): Promise<User['username'][]> => {
  const params = { userIds };

  const { data } = await publicClient.get<UsersResponse>(
    `/users/${username}/followed`,
    { params },
  );

  return data.data.map((user) => user.username);
};

const fetchCurrentUser = async (
  token?: Token,
  signal?: AbortSignal,
): Promise<StoredUser> => {
  if (!token) throw new Error('No token provided');

  const params = { userFields: 'username, profile, metrics, createdAt' };
  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await publicClient.get<{ data: User }>('/me', {
    params,
    signal,
    headers,
  });

  const user = data.data;

  return { ...user, token };
};

const fetchFollowUser = async (
  newFollowUsername: User['username'],
): Promise<void> => {
  await privateClient.post(`/me/followed`, { username: newFollowUsername });
};

const fetchUnfollowUser = async (
  deletedFollowUsername: User['username'],
): Promise<void> => {
  await privateClient.delete(`/me/followed/${deletedFollowUsername}`);
};

const fetchUpdateProfile = async (
  profile: User['profile'],
): Promise<User['profile']> => {
  const { data } = await privateClient.put<{ data: User['profile'] }>(
    '/me/profile',
    profile,
  );

  return data.data;
};

const fetchUpdateUsername = async (
  updateUsernameParams: UpdateUsernameParams,
): Promise<User['username']> => {
  const { data } = await privateClient.put<{ data: User['username'] }>(
    '/me/username',
    updateUsernameParams,
  );

  return data.data;
};

const fetchUpdateEmail = async (
  updateEmailParams: UpdateEmailParams,
): Promise<string> => {
  const { data } = await privateClient.put<{ data: string }>(
    '/me/email',
    updateEmailParams,
  );

  return data.data;
};

const fetchUpdatePassword = async (
  updatePasswordParams: UpdatePasswordParams,
): Promise<void> => {
  await privateClient.put('/me/password', updatePasswordParams);
};

const fetchDeleteCurrentOne = async (password: string): Promise<void> => {
  await privateClient.delete('/me', { data: { password } });
};

export {
  fetchUser,
  fetchLikingUsers,
  fetchFollowedUsers,
  fetchFollowingUsers,
  fetchFollowedUsernames,
  fetchCurrentUser,
  fetchFollowUser,
  fetchUnfollowUser,
  fetchUpdateProfile,
  fetchUpdateUsername,
  fetchUpdateEmail,
  fetchUpdatePassword,
  fetchDeleteCurrentOne,
};
