import { Token } from '../../interface';
import { User } from '../users';

interface LogInData {
  login: string;
  password: string;
}

interface SignUpData {
  email: string;
  name: User['profile']['name'];
  password: string;
  username: User['username'];
}

interface SignUpFormData extends SignUpData {
  passwordConfirm: string;
}

interface TokenResponse {
  data: {
    authToken: Token;
  };
}

export { LogInData, SignUpData, SignUpFormData, TokenResponse };
