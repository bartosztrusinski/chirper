import useCurrentUser from './useCurrentUser';
import { StoredUser, User } from '../interface';
import { privateClient } from '../../../apiClient';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import userKeys from '../queryKeys';

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

const fetchUpdateProfile = async (
  profile: User['profile'],
): Promise<User['profile']> => {
  const { data } = await privateClient.put<{ data: User['profile'] }>(
    '/me/profile',
    profile,
  );

  return data.data;
};

const fetchUpdateUsername = async ({
  newUsername,
  password,
}: UpdateUsername): Promise<User['username']> => {
  const { data } = await privateClient.put<{ data: User['username'] }>(
    '/me/username',
    { newUsername, password },
  );

  return data.data;
};

const fetchUpdateEmail = async ({
  newEmail,
  password,
}: UpdateEmail): Promise<string> => {
  const { data } = await privateClient.put<{ data: string }>('/me/email', {
    newEmail,
    password,
  });

  return data.data;
};

const fetchUpdatePassword = async ({
  password,
  newPassword,
}: UpdatePassword): Promise<void> => {
  await privateClient.put('/me/password', { password, newPassword });
};

const fetchDeleteCurrentOne = async (password: string): Promise<void> => {
  await privateClient.delete('/me', { data: { password } });
};

const useManageUser = (): UseManageUser => {
  const queryClient = useQueryClient();
  const { currentUser, updateUser, clearUser } = useCurrentUser();

  const handleUpdateMutate = (newData: Partial<StoredUser>) => {
    queryClient.cancelQueries(userKeys.current());

    const previousUserData = queryClient.getQueryData<StoredUser>(
      userKeys.current(),
    );

    if (previousUserData && newData) {
      updateUser({ ...previousUserData, ...newData });
    }

    return previousUserData;
  };

  const handleError = (previousUserData?: StoredUser) => {
    if (previousUserData) {
      updateUser(previousUserData);
    }
  };

  const handleSettled = () => {
    queryClient.invalidateQueries(userKeys.current());
  };

  const { mutate: updateProfile } = useMutation(
    userKeys.update(),
    fetchUpdateProfile,
    {
      onMutate: (newProfile) => {
        const previousUserData = handleUpdateMutate({ profile: newProfile });
        return { previousUserData };
      },
      onError: (error, profileData, context) => {
        handleError(context?.previousUserData);
      },
      onSettled: () => {
        handleSettled();
        if (currentUser) {
          queryClient.invalidateQueries(userKeys.detail(currentUser.username));
        }
      },
    },
  );

  const { mutate: updateUsername } = useMutation(
    userKeys.update(),
    fetchUpdateUsername,
    {
      onMutate: ({ newUsername }) => {
        const previousUserData = handleUpdateMutate({ username: newUsername });
        return { previousUserData };
      },
      onError: (error, usernameData, context) => {
        handleError(context?.previousUserData);
      },
      onSettled: () => {
        handleSettled();
      },
    },
  );

  const { mutate: updateEmail } = useMutation(
    userKeys.update(),
    fetchUpdateEmail,
  );

  const { mutate: updatePassword } = useMutation(
    userKeys.update(),
    fetchUpdatePassword,
  );

  const { mutate: deleteUser } = useMutation(
    userKeys.update(),
    fetchDeleteCurrentOne,
    {
      onMutate: () => {
        queryClient.cancelQueries(userKeys.current());

        const previousUserData = queryClient.getQueryData<StoredUser>(
          userKeys.current(),
        );

        if (previousUserData) {
          clearUser();
        }

        return { previousUserData };
      },
      onError: (error, passwordData, context) => {
        handleError(context?.previousUserData);
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

export default useManageUser;
