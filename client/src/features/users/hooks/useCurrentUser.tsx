import { useQuery, useQueryClient } from '@tanstack/react-query';
import { publicClient } from '../../../apiClient';
import { Token } from '../../../interface';
import { StoredUser, User } from '../interface';
import userKeys from '../queryKeys';
import { getStoredUser, clearStoredUser, setStoredUser } from '../storage';

interface UseCurrentUser {
  currentUser: StoredUser | undefined;
  setUser: (token: Token) => void;
  updateUser: (user: StoredUser) => void;
  clearUser: () => void;
}

const fetchCurrentUser = async (
  token?: Token,
  signal?: AbortSignal,
): Promise<StoredUser> => {
  if (!token) throw new Error('No token provided');
  const params = { userFields: 'username, profile, metrics, createdAt' };
  const headers = { Authorization: `Bearer ${token}` };

  const { data } = await publicClient.get<{ data: User }>('/me', {
    params,
    signal,
    headers,
  });

  const user = data.data;

  return { ...user, token };
};

const useCurrentUser = (): UseCurrentUser => {
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery<StoredUser>(
    userKeys.current(),
    ({ signal }): Promise<StoredUser> =>
      fetchCurrentUser(getStoredUser()?.token, signal),
    {
      initialData: getStoredUser,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 15,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (user) => setStoredUser(user),
      onError: () => clearStoredUser(),
    },
  );

  const setUser = async (token: Token) => {
    const user = await fetchCurrentUser(token);
    updateUser(user);
  };

  const updateUser = (newUser: StoredUser) => {
    queryClient.setQueryData(userKeys.current(), newUser);
    setStoredUser(newUser);
  };

  const clearUser = () => {
    queryClient.setQueryData(userKeys.current(), null);
    clearStoredUser();
  };

  return {
    currentUser,
    setUser,
    updateUser,
    clearUser,
  };
};

export default useCurrentUser;
