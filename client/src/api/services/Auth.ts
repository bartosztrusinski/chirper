import client from '../client';

const logIn = async (login: string, password: string) => {
  const { data } = await client.post<{ data: { authToken: string } }>(
    `/users/login`,
    {
      login,
      password,
    },
  );

  return data.data.authToken;
};

const signUp = async (
  username: string,
  name: string,
  email: string,
  password: string,
) => {
  const { data } = await client.post<{ data: { authToken: string } }>(
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

export default {
  logIn,
  signUp,
};
