import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import UserService from '../api/services/User';
import { StoredUser, User } from '../interfaces/User';
import useUser from './useUser';

const useFollowUser = (queryKeys: string[], page?: number) => {
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser } = useUser();
  const SERVER_ERROR = 'There was an error contacting the server';

  const followedUsernamesQueryKeys = ['followedUsernames', ...queryKeys];
  const currentUserQueryKeys = ['user'];
  const currentUserProfileQueryKeys = ['users', currentUser?.username];
  const currentUserFollowedQueryKeys = [
    ...currentUserProfileQueryKeys,
    'followed',
  ];

  if (page !== undefined) {
    followedUsernamesQueryKeys.push(page.toString());
  }

  const { mutate: followUser } = useMutation(
    (newFollowUsername: string) => UserService.followUser(newFollowUsername),
    {
      onMutate: (newFollowUsername: string) => {
        const newFollowQueryKeys = ['users', newFollowUsername];

        queryClient.cancelQueries(followedUsernamesQueryKeys);
        queryClient.cancelQueries(newFollowQueryKeys);
        queryClient.cancelQueries(currentUserQueryKeys);
        queryClient.cancelQueries(currentUserProfileQueryKeys);

        const followedUsernamesSnapshot = queryClient.getQueryData<string[]>(
          followedUsernamesQueryKeys,
        );

        if (followedUsernamesSnapshot) {
          queryClient.setQueryData(followedUsernamesQueryKeys, [
            ...followedUsernamesSnapshot,
            newFollowUsername,
          ]);
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

        const currentUserSnapshot = queryClient.getQueryData<StoredUser | null>(
          currentUserQueryKeys,
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

        const currentUserProfileSnapshot = queryClient.getQueryData<User>(
          currentUserProfileQueryKeys,
        );

        if (currentUserProfileSnapshot) {
          queryClient.setQueryData(currentUserProfileQueryKeys, {
            ...currentUserProfileSnapshot,
            metrics: {
              ...currentUserProfileSnapshot.metrics,
              followedCount:
                currentUserProfileSnapshot.metrics.followedCount + 1,
            },
          });
        }

        return {
          followedUsernamesSnapshot,
          newFollowSnapshot,
          newFollowQueryKeys,
          currentUserSnapshot,
          currentUserProfileSnapshot,
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
            followedUsernamesQueryKeys,
            context.followedUsernamesSnapshot,
          );
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
        queryClient.invalidateQueries(followedUsernamesQueryKeys);
        queryClient.invalidateQueries(context?.newFollowQueryKeys);
        queryClient.invalidateQueries(currentUserQueryKeys);
        queryClient.invalidateQueries(currentUserProfileQueryKeys);
      },
    },
  );

  const { mutate: unfollowUser } = useMutation(
    (deletedFollowUsername: string) =>
      UserService.unfollowUser(deletedFollowUsername),
    {
      onMutate: (deletedFollowUsername: string) => {
        const deletedFollowQueryKeys = ['users', deletedFollowUsername];

        queryClient.cancelQueries(followedUsernamesQueryKeys);
        queryClient.cancelQueries(deletedFollowQueryKeys);
        queryClient.cancelQueries(currentUserQueryKeys);
        queryClient.cancelQueries(currentUserProfileQueryKeys);
        queryClient.cancelQueries(currentUserFollowedQueryKeys);

        const followedUsernamesSnapshot = queryClient.getQueryData<string[]>(
          followedUsernamesQueryKeys,
        );

        if (followedUsernamesSnapshot) {
          queryClient.setQueryData(
            followedUsernamesQueryKeys,
            followedUsernamesSnapshot.filter(
              (followedUsername) => followedUsername !== deletedFollowUsername,
            ),
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

        const currentUserSnapshot = queryClient.getQueryData<StoredUser | null>(
          currentUserQueryKeys,
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

        const currentUserProfileSnapshot = queryClient.getQueryData<User>(
          currentUserProfileQueryKeys,
        );

        if (currentUserProfileSnapshot) {
          queryClient.setQueryData(currentUserProfileQueryKeys, {
            ...currentUserProfileSnapshot,
            metrics: {
              ...currentUserProfileSnapshot.metrics,
              followedCount:
                currentUserProfileSnapshot.metrics.followedCount - 1,
            },
          });
        }

        const currentUserFollowedSnapshot = queryClient.getQueryData<
          InfiniteData<{ data: User[]; meta?: { nextPage?: string } }>
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
          followedUsernamesSnapshot,
          deletedFollowSnapshot,
          deletedFollowQueryKeys,
          currentUserSnapshot,
          currentUserProfileSnapshot,
          currentUserFollowedSnapshot,
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
            followedUsernamesQueryKeys,
            context.followedUsernamesSnapshot,
          );
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
        queryClient.invalidateQueries(followedUsernamesQueryKeys);
        queryClient.invalidateQueries(context?.deletedFollowQueryKeys);
        queryClient.invalidateQueries(currentUserQueryKeys);
        queryClient.invalidateQueries(currentUserProfileQueryKeys);
        queryClient.invalidateQueries(currentUserFollowedQueryKeys);
      },
    },
  );

  return { followUser, unfollowUser };
};

export default useFollowUser;
