import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import UserService from '../api/services/User';
import { StoredUser, User } from '../interfaces/User';
import useUser from './useUser';

const useFollowUser = (queryKeys: string[]) => {
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser } = useUser();
  const SERVER_ERROR = 'There was an error contacting the server';

  const { mutate: followUser } = useMutation(
    (newFollowUsername: string) => UserService.followUser(newFollowUsername),
    {
      onMutate: (newFollowUsername: string) => {
        queryClient.cancelQueries(['followedUsernames', ...queryKeys]);
        queryClient.cancelQueries(['users', newFollowUsername]);
        queryClient.cancelQueries(['user']);

        const followedUsernamesSnapshot = queryClient.getQueryData<string[]>([
          'followedUsernames',
          ...queryKeys,
        ]);

        if (followedUsernamesSnapshot) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            [...followedUsernamesSnapshot, newFollowUsername],
          );
        }

        const newFollowSnapshot = queryClient.getQueryData<User>([
          'users',
          newFollowUsername,
        ]);

        if (newFollowSnapshot) {
          queryClient.setQueryData(['users', newFollowUsername], {
            ...newFollowSnapshot,
            metrics: {
              ...newFollowSnapshot.metrics,
              followingCount: newFollowSnapshot.metrics.followingCount + 1,
            },
          });
        }

        const currentUserSnapshot = queryClient.getQueryData<StoredUser | null>(
          ['user'],
        );

        if (currentUserSnapshot) {
          updateUser({
            ...currentUserSnapshot,
            metrics: {
              ...currentUserSnapshot.metrics,
              followedCount: currentUserSnapshot.metrics.followedCount + 1,
            },
          });
        }

        return {
          followedUsernamesSnapshot,
          newFollowSnapshot,
          currentUserSnapshot,
        };
      },
      onSuccess: () => {
        console.log('User followed successfully');
      },
      onError: (error, newFollowUsername, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);

        if (context?.followedUsernamesSnapshot) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            context.followedUsernamesSnapshot,
          );
        }

        if (context?.newFollowSnapshot) {
          queryClient.setQueryData(
            ['users', newFollowUsername],
            context.newFollowSnapshot,
          );
        }

        if (context?.currentUserSnapshot) {
          updateUser(context.currentUserSnapshot);
        }
      },
      onSettled: (data, error, newFollowUsername) => {
        queryClient.invalidateQueries(['followedUsernames', ...queryKeys]);
        queryClient.invalidateQueries(['users', newFollowUsername]);
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries([
          'users',
          currentUser?.username,
          'followed',
        ]);
      },
    },
  );

  const { mutate: unfollowUser } = useMutation(
    (deletedFollowUsername: string) =>
      UserService.unfollowUser(deletedFollowUsername),
    {
      onMutate: (deletedFollowUsername: string) => {
        queryClient.cancelQueries(['followedUsernames', ...queryKeys]);
        queryClient.cancelQueries(['users', deletedFollowUsername]);
        queryClient.cancelQueries(['user']);
        queryClient.cancelQueries(['users', currentUser?.username, 'followed']);

        const followedUsernamesSnapshot = queryClient.getQueryData<string[]>([
          'followedUsernames',
          ...queryKeys,
        ]);

        if (followedUsernamesSnapshot) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            followedUsernamesSnapshot.filter(
              (followedUsername) => followedUsername !== deletedFollowUsername,
            ),
          );
        }

        const deletedFollowSnapshot = queryClient.getQueryData<User>([
          'users',
          deletedFollowUsername,
        ]);

        if (deletedFollowSnapshot) {
          queryClient.setQueryData(['users', deletedFollowUsername], {
            ...deletedFollowSnapshot,
            metrics: {
              ...deletedFollowSnapshot.metrics,
              followingCount: deletedFollowSnapshot.metrics.followingCount - 1,
            },
          });
        }

        const currentUserSnapshot = queryClient.getQueryData<StoredUser | null>(
          ['user'],
        );

        if (currentUserSnapshot) {
          updateUser({
            ...currentUserSnapshot,
            metrics: {
              ...currentUserSnapshot.metrics,
              followedCount: currentUserSnapshot.metrics.followedCount - 1,
            },
          });
        }

        const currentUserFollowsSnapshot = queryClient.getQueryData<User[]>([
          'users',
          currentUser?.username,
          'followed',
        ]);

        if (currentUserFollowsSnapshot) {
          queryClient.setQueryData(
            ['users', currentUser?.username, 'followed'],
            currentUserFollowsSnapshot.filter(
              (follow) => follow.username !== deletedFollowUsername,
            ),
          );
        }

        return {
          followedUsernamesSnapshot,
          deletedFollowSnapshot,
          currentUserSnapshot,
          currentUserFollowsSnapshot,
        };
      },
      onSuccess: () => {
        console.log('User unfollowed successfully');
      },
      onError: (error, deletedFollowUsername, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);

        if (context?.followedUsernamesSnapshot) {
          queryClient.setQueryData(
            ['followedUsernames', ...queryKeys],
            context.followedUsernamesSnapshot,
          );
        }

        if (context?.deletedFollowSnapshot) {
          queryClient.setQueryData(
            ['users', deletedFollowUsername],
            context.deletedFollowSnapshot,
          );
        }

        if (context?.currentUserSnapshot) {
          updateUser(context.currentUserSnapshot);
        }

        if (context?.currentUserFollowsSnapshot) {
          queryClient.setQueryData(
            ['users', currentUser?.username, 'followed'],
            context.currentUserFollowsSnapshot,
          );
        }
      },
      onSettled: (data, error, deletedFollowUsername) => {
        queryClient.invalidateQueries(['followedUsernames', ...queryKeys]);
        queryClient.invalidateQueries(['users', deletedFollowUsername]);
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries([
          'users',
          currentUser?.username,
          'followed',
        ]);
      },
    },
  );

  return { followUser, unfollowUser };
};

export default useFollowUser;
