import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserService from '../api/services/User';
import { StoredUser, Token } from '../interfaces/User';
import { getStoredUser, clearStoredUser, setStoredUser } from '../user-storage';

interface UseUser {
  currentUser: StoredUser | undefined;
  setUser: (token: Token) => void;
  updateUser: (user: StoredUser) => void;
  clearUser: () => void;
}

const getUser = async (
  token?: Token,
  signal?: AbortSignal,
): Promise<StoredUser> => {
  if (!token) throw new Error('No token provided');
  const user = await UserService.getCurrentOne(token, signal);
  return { ...user, token };
};

const useUser = (): UseUser => {
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery<StoredUser>(
    ['user'],
    ({ signal }): Promise<StoredUser> =>
      getUser(getStoredUser()?.token, signal),
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
    const user = await getUser(token);
    updateUser(user);
  };

  const updateUser = (newUser: StoredUser) => {
    queryClient.setQueryData(['user'], newUser);
    setStoredUser(newUser);
  };

  const clearUser = () => {
    queryClient.setQueryData(['user'], null);
    clearStoredUser();
  };

  return {
    currentUser,
    setUser,
    updateUser,
    clearUser,
  };
};

export default useUser;
