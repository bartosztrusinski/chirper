import AuthService from '../api/services/Auth';
import useUser from './useUser';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { Token } from '../interfaces/User';

interface LogInData {
  login: string;
  password: string;
}

interface SignUpData {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface UseAuth {
  logIn: UseMutateFunction<Token, unknown, LogInData, unknown>;
  signUp: UseMutateFunction<Token, unknown, SignUpData, unknown>;
  logOut: () => void;
}

const useAuth = (): UseAuth => {
  const { clearUser, setUser } = useUser();

  const { mutate: logIn } = useMutation(
    ({ login, password }: LogInData) => AuthService.logIn(login, password),
    { onSuccess: (token: Token) => setUser(token) },
  );

  const { mutate: signUp } = useMutation(
    ({ username, name, email, password }: SignUpData) =>
      AuthService.signUp(username, name, email, password),
    { onSuccess: (token: Token) => setUser(token) },
  );

  const logOut = () => clearUser();

  return {
    logIn,
    signUp,
    logOut,
  };
};

export default useAuth;
