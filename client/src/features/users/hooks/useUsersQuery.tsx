import { User, UsersResponse } from '../interface';
import useCurrentUser from './useCurrentUser';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { publicClient } from '../../../apiClient';
import userKeys from '../queryKeys';

type UseUsersQuery = ({
  queryFn,
  queryKeys,
}: {
  queryFn: (sinceId?: string) => Promise<UsersResponse>;
  queryKeys: readonly unknown[];
}) => UseInfiniteQueryResult<UsersResponse>;

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

const useUserQuery = (username: string): UseQueryResult<User> => {
  const { currentUser } = useCurrentUser();

  return useQuery(
    userKeys.detail(username),
    async () => {
      const user = await fetchUser(username);

      if (!currentUser || currentUser.username === username) {
        return user;
      }

      const followedUsernames = await fetchFollowedUsernames(
        currentUser.username,
        [user._id],
      );

      return { ...user, isFollowed: followedUsernames.includes(user.username) };
    },
    { retry: false },
  );
};

const useUsersQuery: UseUsersQuery = ({ queryFn, queryKeys }) => {
  const { currentUser } = useCurrentUser();

  return useInfiniteQuery(
    queryKeys,
    async ({ pageParam }) => {
      const { data, ...rest } = await queryFn(pageParam);

      if (!currentUser || data.length === 0) {
        return { data, ...rest };
      }

      const followedUsernames = await fetchFollowedUsernames(
        currentUser.username,
        data.map((user) => user._id),
      );

      return {
        data: data.map((user) => ({
          ...user,
          isFollowed: followedUsernames.includes(user.username),
        })),
        ...rest,
      };
    },
    { getNextPageParam: (lastPage) => lastPage.meta?.nextPage },
  );
};

const useFollowedUsersQuery = (
  username: string,
): UseInfiniteQueryResult<UsersResponse> => {
  return useUsersQuery({
    queryKeys: userKeys.list('followed', username),
    queryFn: (sinceId?: string) => fetchFollowedUsers(username, sinceId),
  });
};

const useFollowingUsersQuery = (
  username: string,
): UseInfiniteQueryResult<UsersResponse> => {
  return useUsersQuery({
    queryKeys: userKeys.list('following', username),
    queryFn: (sinceId?: string) => fetchFollowingUsers(username, sinceId),
  });
};

const useLikingUsersQuery = (
  chirpId: string,
): UseInfiniteQueryResult<UsersResponse> => {
  return useUsersQuery({
    queryKeys: userKeys.list('liking', chirpId),
    queryFn: (sinceId?: string) => fetchLikingUsers(chirpId, sinceId),
  });
};

export {
  useUserQuery,
  useFollowedUsersQuery,
  useFollowingUsersQuery,
  useLikingUsersQuery,
};
