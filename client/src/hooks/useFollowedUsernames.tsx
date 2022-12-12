import { useQuery } from '@tanstack/react-query';
import UserService from '../api/services/User';
import useUser from './useUser';

const useFollowedUsernames = (queryKeys: unknown[], userIds: string[]) => {
  const { user } = useUser();

  return useQuery(
    ['followedUsernames', ...queryKeys],
    () => UserService.getFollowedUsernames(user!.username, userIds),
    { enabled: Boolean(userIds.length && user) },
  );
};

export default useFollowedUsernames;
