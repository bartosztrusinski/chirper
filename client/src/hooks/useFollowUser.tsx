import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import UserService from '../api/services/User';
import { StoredUser, User } from '../interfaces/User';
import useUser from './useUser';

const useFollowUser = (queryKeys: string[]) => {
  const queryClient = useQueryClient();
  const { updateUser } = useUser();
  const SERVER_ERROR = 'There was an error contacting the server';

  const { mutate: followUser } = useMutation(
    (username: string) => UserService.followUser(username),
    {
      onMutate: (username: string) => {
        queryClient.cancelQueries(['followedUserIds', ...queryKeys]);
        queryClient.cancelQueries(['users', username]);
        queryClient.cancelQueries(['user']);

        const previousFollowedUsernames = queryClient.getQueryData<string[]>([
          'followedUsernames',
          ...queryKeys,
        ]);

        if (previousFollowedUsernames) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            [...previousFollowedUsernames, username],
          );
        }

        const previousFollowedUserData = queryClient.getQueryData<User>([
          'users',
          username,
        ]);

        if (previousFollowedUserData) {
          queryClient.setQueryData(['users', username], {
            ...previousFollowedUserData,
            metrics: {
              ...previousFollowedUserData.metrics,
              followingCount:
                previousFollowedUserData.metrics.followingCount + 1,
            },
          });
        }

        const previousUserData = queryClient.getQueryData<StoredUser | null>([
          'user',
        ]);

        if (previousUserData) {
          updateUser({
            ...previousUserData,
            metrics: {
              ...previousUserData.metrics,
              followedCount: previousUserData.metrics.followedCount + 1,
            },
          });
        }

        return {
          previousFollowedUsernames,
          previousFollowedUserData,
          previousUserData,
        };
      },
      onSuccess: () => {
        console.log('User followed successfully');
      },
      onError: (error, username, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);

        if (context?.previousFollowedUsernames) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            context.previousFollowedUsernames,
          );
        }

        if (context?.previousFollowedUserData) {
          queryClient.setQueryData(
            ['users', username],
            context.previousFollowedUserData,
          );
        }

        if (context?.previousUserData) {
          updateUser(context.previousUserData);
        }
      },
      onSettled: (data, error, username) => {
        queryClient.invalidateQueries(['followedUsernames', ...queryKeys]);
        queryClient.invalidateQueries(['users', username]);
        queryClient.invalidateQueries(['user']);
      },
    },
  );

  const { mutate: unfollowUser } = useMutation(
    (username: string) => UserService.unfollowUser(username),
    {
      onMutate: (username: string) => {
        queryClient.cancelQueries(['followedUserIds', ...queryKeys]);
        queryClient.cancelQueries(['users', username]);
        queryClient.cancelQueries(['user']);

        const previousFollowedUsernames = queryClient.getQueryData<string[]>([
          'followedUsernames',
          ...queryKeys,
        ]);

        if (previousFollowedUsernames) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            previousFollowedUsernames.filter(
              (followedUsername) => followedUsername !== username,
            ),
          );
        }

        const previousFollowedUserData = queryClient.getQueryData<User>([
          'users',
          username,
        ]);

        if (previousFollowedUserData) {
          queryClient.setQueryData(['users', username], {
            ...previousFollowedUserData,
            metrics: {
              ...previousFollowedUserData.metrics,
              followingCount:
                previousFollowedUserData.metrics.followingCount - 1,
            },
          });
        }

        const previousUserData = queryClient.getQueryData<StoredUser | null>([
          'user',
        ]);

        if (previousUserData) {
          updateUser({
            ...previousUserData,
            metrics: {
              ...previousUserData.metrics,
              followedCount: previousUserData.metrics.followedCount - 1,
            },
          });
        }

        return {
          previousFollowedUsernames,
          previousFollowedUserData,
          previousUserData,
        };
      },
      onSuccess: () => {
        console.log('User unfollowed successfully');
      },
      onError: (error, username, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);

        if (context?.previousFollowedUsernames) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            context.previousFollowedUsernames,
          );
        }

        if (context?.previousFollowedUserData) {
          queryClient.setQueryData(
            ['users', username],
            context.previousFollowedUserData,
          );
        }

        if (context?.previousUserData) {
          updateUser(context.previousUserData);
        }
      },
      onSettled: (data, error, username) => {
        queryClient.invalidateQueries(['followedUsernames', ...queryKeys]);
        queryClient.invalidateQueries(['users', username]);
        queryClient.invalidateQueries(['user']);
      },
    },
  );

  return { followUser, unfollowUser };
};

export default useFollowUser;
