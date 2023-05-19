import useCurrentUser from './useCurrentUser';
import {
  StoredUser,
  UpdateEmailParams,
  UpdatePasswordParams,
  UpdateUsernameParams,
  User,
} from '../interface';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import userKeys from '../queryKeys';
import {
  fetchDeleteCurrentOne,
  fetchUpdateEmail,
  fetchUpdatePassword,
  fetchUpdateProfile,
  fetchUpdateUsername,
} from '../api';

type UseManageUser = () => {
  updateProfile: UseMutateFunction<
    User['profile'],
    unknown,
    User['profile'],
    unknown
  >;
  updateUsername: UseMutateFunction<
    User['username'],
    unknown,
    UpdateUsernameParams,
    unknown
  >;
  updateEmail: UseMutateFunction<string, unknown, UpdateEmailParams, unknown>;
  updatePassword: UseMutateFunction<
    void,
    unknown,
    UpdatePasswordParams,
    unknown
  >;
  deleteUser: UseMutateFunction<void, unknown, string, unknown>;
};

const useManageUser: UseManageUser = () => {
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
