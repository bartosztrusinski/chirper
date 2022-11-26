import { useQuery } from '@tanstack/react-query';
import UserService from '../api/services/User';

const useFollowedUsernames = (
  queryKeys: string[],
  username: string,
  userIds: string[],
) =>
  useQuery(['followedUsernames', ...queryKeys], () =>
    UserService.getFollowedUserIds(username, userIds),
  );

export default useFollowedUsernames;
