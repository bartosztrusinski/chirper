import authKeys from '../queryKeys';
import { useCurrentUser } from '../../users';
import { Token } from '../../../interface';
import { LogInData, SignUpData } from '../interface';
import { fetchLogIn, fetchSignUp } from '../api';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type UseAuth = () => {
  logIn: UseMutateFunction<Token, unknown, LogInData, unknown>;
  signUp: UseMutateFunction<Token, unknown, SignUpData, unknown>;
  logOut: () => void;
};

const useAuth: UseAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useCurrentUser();

  const { mutate: logIn } = useMutation(authKeys.update('logIn'), fetchLogIn, {
    onSuccess: (token: Token) => setUser(token),
  });

  const { mutate: signUp } = useMutation(
    authKeys.update('signUp'),
    fetchSignUp,
    { onSuccess: (token: Token) => setUser(token) },
  );

  const logOut = () => {
    clearUser();
    queryClient.clear();
  };

  return { logIn, signUp, logOut };
};

export default useAuth;
