import { useCurrentUser } from '../../users';
import { Token } from '../../../interface';
import { publicClient } from '../../../apiClient';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { LogInData, RegisterData } from '../interface';
import authKeys from '../queryKeys';

interface UseAuth {
  logIn: UseMutateFunction<Token, unknown, LogInData, unknown>;
  signUp: UseMutateFunction<Token, unknown, RegisterData, unknown>;
  logOut: () => void;
}

const fetchLogIn = async ({ login, password }: LogInData) => {
  const { data } = await publicClient.post<{ data: { authToken: string } }>(
    `/users/login`,
    { login, password },
  );

  return data.data.authToken;
};

const fetchSignUp = async ({
  username,
  name,
  email,
  password,
}: RegisterData) => {
  const { data } = await publicClient.post<{ data: { authToken: string } }>(
    '/users',
    {
      username,
      name,
      email,
      password,
    },
  );

  return data.data.authToken;
};

const useAuth = (): UseAuth => {
  const { setUser, clearUser } = useCurrentUser();

  const { mutate: logIn } = useMutation(authKeys.update('logIn'), fetchLogIn, {
    onSuccess: (token: Token) => setUser(token),
  });

  const { mutate: signUp } = useMutation(
    authKeys.update('signUp'),
    fetchSignUp,
    { onSuccess: (token: Token) => setUser(token) },
  );

  const logOut = () => clearUser();

  return { logIn, signUp, logOut };
};

export default useAuth;
