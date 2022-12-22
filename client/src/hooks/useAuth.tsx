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
  isLoggingIn: boolean;
  isSigningUp: boolean;
}

const useAuth = (): UseAuth => {
  const { clearUser, setUser } = useUser();

  const { mutate: logIn, status: logInStatus } = useMutation(
    ({ login, password }: LogInData) => AuthService.logIn(login, password),
    { onSuccess: (token: Token) => setUser(token) },
  );

  const { mutate: signUp, status: signUpStatus } = useMutation(
    ({ username, name, email, password }: SignUpData) =>
      AuthService.signUp(username, name, email, password),
    { onSuccess: (token: Token) => setUser(token) },
  );

  const logOut = () => clearUser();

  return {
    logIn,
    signUp,
    logOut,
    isLoggingIn: logInStatus === 'loading' || logInStatus === 'success',
    isSigningUp: signUpStatus === 'loading' || signUpStatus === 'success',
  };
};

export default useAuth;
