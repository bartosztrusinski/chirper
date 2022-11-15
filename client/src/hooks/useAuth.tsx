import axios from 'axios';
import AuthService from '../api/services/Auth';
import UserService from '../api/services/User';
import useUser from './useUser';
import { useMutation } from '@tanstack/react-query';

const useAuth = () => {
  const SERVER_ERROR = 'There was an error contacting the server';
  const { clearUser, updateUser } = useUser();

  const logInMutation = useMutation(
    ({ login, password }: { login: string; password: string }) =>
      AuthService.logIn(login, password),
    {
      onSuccess: async (authToken: string) => {
        const { data } = await UserService.getCurrentOne(authToken);
        updateUser({ user: data.data, token: authToken });
      },
      onError: (errorResponse) => {
        const title =
          axios.isAxiosError(errorResponse) &&
          errorResponse?.response?.data?.message
            ? errorResponse?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);
      },
    },
  );

  const signUpMutation = useMutation(
    ({
      email,
      username,
      name,
      password,
    }: {
      email: string;
      username: string;
      name: string;
      password: string;
    }) => AuthService.signUp(email, username, name, password),
    {
      onSuccess: async (authToken: string) => {
        const { data } = await UserService.getCurrentOne(authToken);
        updateUser({ user: data.data, token: authToken });
      },
      onError: (errorResponse) => {
        const title =
          axios.isAxiosError(errorResponse) &&
          errorResponse?.response?.data?.message
            ? errorResponse?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);
      },
    },
  );

  const logIn = async (login: string, password: string) => {
    logInMutation.mutate({ login, password });
  };

  const signUp = async (
    email: string,
    username: string,
    name: string,
    password: string,
  ) => {
    signUpMutation.mutate({ email, username, name, password });
  };

  const logOut = () => {
    clearUser();
  };

  return {
    logIn,
    logOut,
    signUp,
  };
};

export default useAuth;
