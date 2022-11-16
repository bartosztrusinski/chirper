import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { StoredUser, Token } from '../interfaces/User';
import UserService from '../api/services/User';
import useUser from './useUser';

interface UsePatchUser {
  patchProfile: UseMutateFunction<
    StoredUser['profile'] | null,
    unknown,
    StoredUser['profile'] | undefined,
    unknown
  >;
}

const patchProfileOnServer = async (
  newProfile?: StoredUser['profile'],
  token?: Token,
): Promise<StoredUser['profile'] | null> => {
  if (!newProfile || !token) return null;

  const patchedProfile = await UserService.updateProfile(newProfile, token);

  return patchedProfile;
};

const usePatchUser = (): UsePatchUser => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useUser();

  const { mutate: patchProfile } = useMutation(
    (profile?: StoredUser['profile']) =>
      patchProfileOnServer(profile, user?.token),
    {
      // onMutate returns context that is passed to onError
      onMutate: (profileData: StoredUser['profile'] | undefined) => {
        // cancel any outgoing queries for user data, so old server data
        // doesn't overwrite our optimistic update
        queryClient.cancelQueries(['user']);

        // snapshot of previous user value
        const previousUserData = queryClient.getQueryData<StoredUser | null>([
          'user',
        ]);

        // if there is no user, we can't patch profile
        if (previousUserData && profileData) {
          // optimistically update the cache with new user value
          const updatedUser = {
            ...previousUserData,
            profile: profileData,
          };

          updateUser(updatedUser);
        }

        // return context object with snapshotted value
        return { previousUserData };
      },
      onError: (error, profileData, context) => {
        // roll back cache to saved value
        if (context?.previousUserData) {
          updateUser(context.previousUserData);
          console.log('Update failed, reverting to previous data');
        }
      },
      onSuccess: (profileData: StoredUser['profile'] | null) => {
        if (profileData) {
          console.log('Update success');
        }
      },
      onSettled: () => {
        // invalidate user query to make sure we're in sync with server data
        queryClient.invalidateQueries(['user']);
      },
    },
  );

  return { patchProfile };
};

export default usePatchUser;
