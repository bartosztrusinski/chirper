import axios from 'axios';
import UserService from '../api/services/User';
import useUser from './useUser';
import { StoredUser } from '../interfaces/User';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

interface UseManageUser {
  updateProfile: UseMutateFunction<
    StoredUser['profile'],
    unknown,
    StoredUser['profile'],
    unknown
  >;
  updateUsername: UseMutateFunction<
    StoredUser['username'],
    unknown,
    UpdateUsername,
    unknown
  >;
  updateEmail: UseMutateFunction<string, unknown, UpdateEmail, unknown>;
  updatePassword: UseMutateFunction<void, unknown, UpdatePassword, unknown>;
  deleteUser: UseMutateFunction<void, unknown, string, unknown>;
}

interface UpdateUsername {
  newUsername: StoredUser['username'];
  password: string;
}

interface UpdateEmail {
  newEmail: string;
  password: string;
}

interface UpdatePassword {
  newPassword: string;
  password: string;
}

const usePatchUser = (): UseManageUser => {
  const queryClient = useQueryClient();
  const { updateUser, clearUser } = useUser();
  const SERVER_ERROR = 'There was an error contacting the server';

  const handleError = (
    error: unknown,
    previousUserData?: StoredUser | null,
  ) => {
    const title =
      axios.isAxiosError(error) && error?.response?.data?.message
        ? error?.response?.data?.message
        : SERVER_ERROR;

    console.log(`Update failed: ${title}`);

    // roll back cache to saved value
    if (previousUserData) {
      updateUser(previousUserData);
    }
  };

  const handleUpdateMutate = (newData: Partial<StoredUser>) => {
    // cancel any outgoing queries for user data, so old server data
    // doesn't overwrite our optimistic update
    queryClient.cancelQueries(['user']);

    // snapshot of previous user value
    const previousUserData = queryClient.getQueryData<StoredUser | null>([
      'user',
    ]);

    // if there is no user, we can't update
    if (previousUserData && newData) {
      // optimistically update the cache with new user value
      updateUser({ ...previousUserData, ...newData });
    }

    // return context object with snapshotted value
    return previousUserData;
  };

  const handleSettled = () => {
    // invalidate user query to make sure we're in sync with server data
    queryClient.invalidateQueries(['user']);
  };

  const { mutate: updateProfile } = useMutation(
    (newProfile: StoredUser['profile']) =>
      UserService.updateProfile(newProfile),
    {
      onMutate: (newProfile) => {
        const previousUserData = handleUpdateMutate({ profile: newProfile });
        return { previousUserData };
      },
      onError: (error, profileData, context) => {
        handleError(error, context?.previousUserData);
      },
      onSuccess: (updatedProfile) => {
        if (updatedProfile) {
          console.log('Profile updated successfully');
        }
      },
      onSettled: () => {
        handleSettled();
      },
    },
  );

  const { mutate: updateUsername } = useMutation(
    ({ newUsername, password }: UpdateUsername) =>
      UserService.updateUsername(newUsername, password),
    {
      onMutate: ({ newUsername }) => {
        const previousUserData = handleUpdateMutate({ username: newUsername });
        return { previousUserData };
      },
      onError: (error, usernameData, context) => {
        handleError(error, context?.previousUserData);
      },
      onSuccess: (updatedUsername) => {
        if (updatedUsername) {
          console.log('Username updated successfully');
        }
      },
      onSettled: () => {
        handleSettled();
      },
    },
  );

  const { mutate: updateEmail } = useMutation(
    ({ newEmail, password }: UpdateEmail) =>
      UserService.updateEmail(newEmail, password),
    {
      // mutate & settled - add email to stored user
      onError: (error) => {
        handleError(error);
      },
      onSuccess: (updatedEmail) => {
        if (updatedEmail) {
          console.log('Email updated successfully');
        }
      },
    },
  );

  const { mutate: updatePassword } = useMutation(
    ({ password, newPassword }: UpdatePassword) =>
      UserService.updatePassword(password, newPassword),
    {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: () => {
        console.log('Password updated successfully');
      },
    },
  );

  const { mutate: deleteUser } = useMutation(
    (password: string) => UserService.deleteCurrentOne(password),
    {
      onMutate: () => {
        queryClient.cancelQueries(['user']);

        const previousUserData = queryClient.getQueryData<StoredUser | null>([
          'user',
        ]);

        if (previousUserData) {
          clearUser();
        }

        return { previousUserData };
      },
      onError: (error, passwordData, context) => {
        handleError(error, context?.previousUserData);
      },
      onSuccess: () => {
        console.log('User deleted successfully');
      },
      onSettled: () => {
        handleSettled();
      },
    },
  );

  return {
    updateProfile,
    updateUsername,
    updateEmail,
    updatePassword,
    deleteUser,
  };
};

export default usePatchUser;
