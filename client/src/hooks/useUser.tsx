import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import UserService from '../api/services/User';
import { StoredUser } from '../interfaces/User';
import { getStoredUser, clearStoredUser, setStoredUser } from '../user-storage';

interface UseUser {
  user: StoredUser | null;
  updateUser: (user: StoredUser) => void;
  clearUser: () => void;
}

const getUser = async (
  user: StoredUser | null,
  signal?: AbortSignal,
): Promise<StoredUser | null> => {
  if (!user) return null;

  const { data } = await UserService.getCurrentOne(user.token, signal);
  return { user: data.data, token: user.token };
};

const useUser = (): UseUser => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery<StoredUser | null>(
    ['user'],
    ({ signal }): Promise<StoredUser | null> => getUser(user, signal),
    {
      initialData: getStoredUser,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 15,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (user) {
      setStoredUser(user);
    } else {
      clearStoredUser();
    }
  }, [user]);

  const updateUser = (newUser: StoredUser) => {
    queryClient.setQueryData(['user'], newUser);
  };

  const clearUser = () => {
    queryClient.setQueryData(['user'], null);
  };

  return {
    user,
    updateUser,
    clearUser,
  };
};

export default useUser;
