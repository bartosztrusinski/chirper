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

const useManageUser = (): UseManageUser => {
  const queryClient = useQueryClient();
  const { currentUser, updateUser, clearUser } = useUser();

  const handleUpdateMutate = (newData: Partial<StoredUser>) => {
    queryClient.cancelQueries(['user']);

    const previousUserData = queryClient.getQueryData<StoredUser>(['user']);

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
    queryClient.invalidateQueries(['user']);
  };

  const { mutate: updateProfile } = useMutation(
    ['user', 'update'],
    (newProfile: StoredUser['profile']) =>
      UserService.updateProfile(newProfile),
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
        queryClient.invalidateQueries(['users', currentUser?.username]);
      },
    },
  );

  const { mutate: updateUsername } = useMutation(
    ['user', 'update'],
    ({ newUsername, password }: UpdateUsername) =>
      UserService.updateUsername(newUsername, password),
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
    ['user', 'update'],
    ({ newEmail, password }: UpdateEmail) =>
      UserService.updateEmail(newEmail, password),
  );

  const { mutate: updatePassword } = useMutation(
    ['user', 'update'],
    ({ password, newPassword }: UpdatePassword) =>
      UserService.updatePassword(password, newPassword),
  );

  const { mutate: deleteUser } = useMutation(
    ['user', 'update'],
    (password: string) => UserService.deleteCurrentOne(password),
    {
      onMutate: () => {
        queryClient.cancelQueries(['user']);

        const previousUserData = queryClient.getQueryData<StoredUser>(['user']);

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
