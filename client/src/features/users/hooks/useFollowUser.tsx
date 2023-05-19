import useCurrentUser from './useCurrentUser';
import userKeys from '../queryKeys';
import { StoredUser, User, UsersResponse } from '../interface';
import { fetchFollowUser, fetchUnfollowUser } from '../api';
import {
  InfiniteData,
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type UseFollowUser = (queryKeys: readonly unknown[]) => {
  followUser: UseMutateFunction<void, unknown, User['username'], unknown>;
  unfollowUser: UseMutateFunction<void, unknown, User['username'], unknown>;
};

const useFollowUser: UseFollowUser = (queryKeys) => {
  const queryClient = useQueryClient();
  const { currentUser, updateUser } = useCurrentUser();
  const usersQueryKeys = queryKeys;
  const currentUserQueryKeys = userKeys.current();
  const currentUserProfileQueryKeys = currentUser
    ? userKeys.detail(currentUser.username)
    : [];
  const currentUserFollowedQueryKeys = currentUser
    ? userKeys.list('followed', currentUser.username)
    : [];

  const { mutate: followUser } = useMutation(fetchFollowUser, {
    onMutate: (newFollowUsername) => {
      const newFollowQueryKeys = userKeys.detail(newFollowUsername);

      queryClient.cancelQueries(usersQueryKeys);
      queryClient.cancelQueries(newFollowQueryKeys);
      queryClient.cancelQueries(currentUserQueryKeys);
      queryClient.cancelQueries(currentUserProfileQueryKeys);

      const usersSnapshot = queryClient.getQueryData<
        User | InfiniteData<UsersResponse>
      >(usersQueryKeys);

      if (usersSnapshot) {
        queryClient.setQueryData(
          usersQueryKeys,
          'pages' in usersSnapshot
            ? {
                ...usersSnapshot,
                pages: usersSnapshot.pages.map((page) => ({
                  ...page,
                  data: page.data.map((user) =>
                    user.username === newFollowUsername
                      ? { ...user, isFollowed: true }
                      : user,
                  ),
                })),
              }
            : { ...usersSnapshot, isFollowed: true },
        );
      }

      const newFollowSnapshot =
        queryClient.getQueryData<User>(newFollowQueryKeys);

      if (newFollowSnapshot) {
        queryClient.setQueryData(newFollowQueryKeys, {
          ...newFollowSnapshot,
          metrics: {
            ...newFollowSnapshot.metrics,
            followingCount: newFollowSnapshot.metrics.followingCount + 1,
          },
        });
      }

      const currentUserSnapshot =
        queryClient.getQueryData<StoredUser>(currentUserQueryKeys);

      if (currentUserSnapshot) {
        updateUser({
          ...currentUserSnapshot,
          metrics: {
            ...currentUserSnapshot.metrics,
            followedCount: currentUserSnapshot.metrics.followedCount + 1,
          },
        });
      }

      const currentUserProfileSnapshot = queryClient.getQueryData<User>(
        currentUserProfileQueryKeys,
      );

      if (currentUserProfileSnapshot) {
        queryClient.setQueryData(currentUserProfileQueryKeys, {
          ...currentUserProfileSnapshot,
          metrics: {
            ...currentUserProfileSnapshot.metrics,
            followedCount: currentUserProfileSnapshot.metrics.followedCount + 1,
          },
        });
      }

      return {
        usersSnapshot,
        newFollowSnapshot,
        newFollowQueryKeys,
        currentUserSnapshot,
        currentUserProfileSnapshot,
      };
    },

    onError: (error, newFollowUsername, context) => {
      if (context?.usersSnapshot) {
        queryClient.setQueryData(usersQueryKeys, context.usersSnapshot);
      }

      if (context?.newFollowSnapshot) {
        queryClient.setQueryData(
          context.newFollowQueryKeys,
          context.newFollowSnapshot,
        );
      }

      if (context?.currentUserSnapshot) {
        updateUser(context.currentUserSnapshot);
      }

      if (context?.currentUserProfileSnapshot) {
        queryClient.setQueryData(
          currentUserProfileQueryKeys,
          context.currentUserProfileSnapshot,
        );
      }
    },

    onSettled: (data, error, newFollowUsername, context) => {
      queryClient.invalidateQueries(usersQueryKeys);
      queryClient.invalidateQueries(context?.newFollowQueryKeys);
      queryClient.invalidateQueries(currentUserQueryKeys);
      queryClient.invalidateQueries(currentUserProfileQueryKeys);
    },
  });

  const { mutate: unfollowUser } = useMutation(fetchUnfollowUser, {
    onMutate: (deletedFollowUsername) => {
      const deletedFollowQueryKeys = userKeys.detail(deletedFollowUsername);

      queryClient.cancelQueries(usersQueryKeys);
      queryClient.cancelQueries(deletedFollowQueryKeys);
      queryClient.cancelQueries(currentUserQueryKeys);
      queryClient.cancelQueries(currentUserProfileQueryKeys);
      queryClient.cancelQueries(currentUserFollowedQueryKeys);

      const usersSnapshot = queryClient.getQueryData<
        User | InfiniteData<UsersResponse>
      >(usersQueryKeys);

      if (usersSnapshot) {
        queryClient.setQueryData(
          usersQueryKeys,
          'pages' in usersSnapshot
            ? {
                ...usersSnapshot,
                pages: usersSnapshot.pages.map((page) => ({
                  ...page,
                  data: page.data.map((user) =>
                    user.username === deletedFollowUsername
                      ? { ...user, isFollowed: false }
                      : user,
                  ),
                })),
              }
            : { ...usersSnapshot, isFollowed: false },
        );
      }

      const deletedFollowSnapshot = queryClient.getQueryData<User>(
        deletedFollowQueryKeys,
      );

      if (deletedFollowSnapshot) {
        queryClient.setQueryData(deletedFollowQueryKeys, {
          ...deletedFollowSnapshot,
          metrics: {
            ...deletedFollowSnapshot.metrics,
            followingCount: deletedFollowSnapshot.metrics.followingCount - 1,
          },
        });
      }

      const currentUserSnapshot =
        queryClient.getQueryData<StoredUser>(currentUserQueryKeys);

      if (currentUserSnapshot) {
        updateUser({
          ...currentUserSnapshot,
          metrics: {
            ...currentUserSnapshot.metrics,
            followedCount: currentUserSnapshot.metrics.followedCount - 1,
          },
        });
      }

      const currentUserProfileSnapshot = queryClient.getQueryData<User>(
        currentUserProfileQueryKeys,
      );

      if (currentUserProfileSnapshot) {
        queryClient.setQueryData(currentUserProfileQueryKeys, {
          ...currentUserProfileSnapshot,
          metrics: {
            ...currentUserProfileSnapshot.metrics,
            followedCount: currentUserProfileSnapshot.metrics.followedCount - 1,
          },
        });
      }

      const currentUserFollowedSnapshot = queryClient.getQueryData<
        InfiniteData<UsersResponse>
      >(currentUserFollowedQueryKeys);

      if (currentUserFollowedSnapshot) {
        queryClient.setQueryData(currentUserFollowedQueryKeys, {
          ...currentUserFollowedSnapshot,
          pages: currentUserFollowedSnapshot.pages.map((page) => ({
            ...page,
            data: page.data.filter(
              (user) => user.username !== deletedFollowUsername,
            ),
          })),
        });
      }

      return {
        usersSnapshot,
        deletedFollowSnapshot,
        deletedFollowQueryKeys,
        currentUserSnapshot,
        currentUserProfileSnapshot,
        currentUserFollowedSnapshot,
      };
    },

    onError: (error, deletedFollowUsername, context) => {
      if (context?.usersSnapshot) {
        queryClient.setQueryData(usersQueryKeys, context.usersSnapshot);
      }

      if (context?.deletedFollowSnapshot) {
        queryClient.setQueryData(
          context.deletedFollowQueryKeys,
          context.deletedFollowSnapshot,
        );
      }

      if (context?.currentUserSnapshot) {
        updateUser(context.currentUserSnapshot);
      }

      if (context?.currentUserProfileSnapshot) {
        queryClient.setQueryData(
          currentUserProfileQueryKeys,
          context.currentUserProfileSnapshot,
        );
      }

      if (context?.currentUserFollowedSnapshot) {
        queryClient.setQueryData(
          currentUserFollowedQueryKeys,
          context.currentUserFollowedSnapshot,
        );
      }
    },

    onSettled: (data, error, deletedFollowUsername, context) => {
      queryClient.invalidateQueries(usersQueryKeys);
      queryClient.invalidateQueries(context?.deletedFollowQueryKeys);
      queryClient.invalidateQueries(currentUserQueryKeys);
      queryClient.invalidateQueries(currentUserProfileQueryKeys);
      queryClient.invalidateQueries(currentUserFollowedQueryKeys);
    },
  });

  return { followUser, unfollowUser };
};

export default useFollowUser;
