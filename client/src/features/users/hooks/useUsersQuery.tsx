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

type UseUsersQuery = ({
  queryFn,
  queryKeys,
}: {
  queryFn: (sinceId?: string) => Promise<UsersResponse>;
  queryKeys: readonly unknown[];
}) => UseInfiniteQueryResult<UsersResponse>;

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
