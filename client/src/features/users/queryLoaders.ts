import userKeys from './queryKeys';
import { queryClient } from '../../context/QueryContext';
import { fetchFollowedUsernames, fetchUser } from './api';
import { User } from './interface';
import { getStoredUser } from './storage';

const loadUser = (username: User['username']) =>
  queryClient.getQueryData(userKeys.detail(username)) ??
  queryClient.fetchQuery(userKeys.detail(username), async () => {
    const currentUser = getStoredUser();
    const user = await fetchUser(username);

    if (!currentUser || currentUser.username === username) {
      return user;
    }

    const followedUsernames = await fetchFollowedUsernames(
      currentUser.username,
      [user._id],
    );

    return { ...user, isFollowed: followedUsernames.includes(user.username) };
  });

export { loadUser };
