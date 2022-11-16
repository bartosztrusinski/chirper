import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import UserService from '../api/services/User';
import { StoredUser, Token } from '../interfaces/User';
import { getStoredUser, clearStoredUser, setStoredUser } from '../user-storage';

interface UseUser {
  user: StoredUser | null;
  setUser: (token: Token) => void;
  updateUser: (user: StoredUser) => void;
  clearUser: () => void;
}

const getUser = async (
  token?: Token,
  signal?: AbortSignal,
): Promise<StoredUser | null> => {
  console.log('#2 getUser', token);
  if (!token) return null;

  const user = await UserService.getCurrentOne(token, signal);

  const storedUser: StoredUser = {
    ...user,
    token,
  };
  return storedUser;
};

const useUser = (): UseUser => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery<StoredUser | null>(
    ['user'],
    ({ signal }): Promise<StoredUser | null> => getUser(user?.token, signal),
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
    console.log('#4 storeUser');
    if (user) {
      setStoredUser(user);
    } else {
      clearStoredUser();
    }
  }, [user]);

  const setUser = async (token: Token) => {
    console.log('#1 setUser');

    const user = await getUser(token);
    if (user) {
      updateUser(user);
    }
  };

  const updateUser = async (user: StoredUser) => {
    console.log('#3 updateUser');

    queryClient.setQueryData(['user'], user);
  };

  const clearUser = () => {
    queryClient.setQueryData(['user'], null);
  };

  return {
    user,
    setUser,
    updateUser,
    clearUser,
  };
};

export default useUser;
