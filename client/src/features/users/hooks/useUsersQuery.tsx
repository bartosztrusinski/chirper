import useCurrentUser from './useCurrentUser';
import userKeys from '../queryKeys';
import { User, UsersResponse } from '../interface';
import {
  fetchFollowedUsernames,
  fetchUser,
  fetchFollowedUsers,
  fetchFollowingUsers,
  fetchLikingUsers,
} from '../api';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

type UseUsersQuery = (
  queryFn: (sinceId?: User['_id']) => Promise<UsersResponse>,
  queryKeys: readonly unknown[],
) => UseUsersQueryResult;

type UseUsersQueryResult = UseInfiniteQueryResult<UsersResponse>;

type UseUserQuery = (username: User['_id']) => UseQueryResult<User>;

const useUserQuery: UseUserQuery = (username) => {
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

const useUsersQuery: UseUsersQuery = (queryFn, queryKeys) => {
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

const useFollowedUsersQuery = (username: string): UseUsersQueryResult =>
  useUsersQuery(
    (sinceId?: string) => fetchFollowedUsers(username, sinceId),
    userKeys.list('followed', username),
  );

const useFollowingUsersQuery = (username: string): UseUsersQueryResult =>
  useUsersQuery(
    (sinceId?: string) => fetchFollowingUsers(username, sinceId),
    userKeys.list('following', username),
  );

const useLikingUsersQuery = (chirpId: string): UseUsersQueryResult =>
  useUsersQuery(
    (sinceId?: string) => fetchLikingUsers(chirpId, sinceId),
    userKeys.list('liking', chirpId),
  );

export {
  useUserQuery,
  useFollowedUsersQuery,
  useFollowingUsersQuery,
  useLikingUsersQuery,
};
