import { useQuery } from '@tanstack/react-query';
import UserService from '../api/services/User';

const useFollowedUsernames = (
  queryKeys: string[],
  username: string,
  userIds: string[],
) =>
  useQuery(
    ['followedUsernames', ...queryKeys],
    () => UserService.getFollowedUsernames(username, userIds),
    {
      enabled: !!userIds.length,
    },
  );

export default useFollowedUsernames;
