import axios from 'axios';
import { publicClient } from '../../apiClient';
import { Token } from '../../interface';
import { LogInData, SignUpData, TokenResponse } from './interface';
import { User } from '../users';

const fetchLogIn = async (logInData: LogInData): Promise<Token> => {
  const { data } = await publicClient.post<TokenResponse>(
    `/users/login`,
    logInData,
  );

  return data.data.authToken;
};

const fetchSignUp = async (registerData: SignUpData): Promise<Token> => {
  const { data } = await publicClient.post<TokenResponse>(
    '/users',
    registerData,
  );

  return data.data.authToken;
};

const fetchIsUsernameTaken = async (
  username: User['username'],
): Promise<boolean> => {
  try {
    await publicClient.head('/users', { params: { username } });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};

const fetchIsEmailTaken = async (email: string): Promise<boolean> => {
  try {
    await publicClient.head('/users', { params: { email } });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};

export { fetchLogIn, fetchSignUp, fetchIsUsernameTaken, fetchIsEmailTaken };
