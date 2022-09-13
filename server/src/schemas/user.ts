import { z } from 'zod';
import {
  transformToId,
  userFields,
  chirpFields,
  transformToBoolean,
  limit,
  ids,
  query,
  page,
  username,
  email,
  password,
  profile,
} from '.';

export type GetUserChirpsQuery = z.infer<typeof getUserChirpsQuery>;
export type GetUsersQuery = z.infer<typeof getUsersQuery>;
export type GetUserQuery = z.infer<typeof getUserQuery>;
export type SearchUsersQuery = z.infer<typeof searchUsersQuery>;
export type SignUpUserBody = z.infer<typeof signUpUserBody>;
export type LogInUserBody = z.infer<typeof logInUserBody>;

export const getUserChirpsQuery = z
  .object({
    sinceId: transformToId,
    userFields,
    chirpFields,
    expandAuthor: transformToBoolean,
    includeReplies: transformToBoolean,
    limit,
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export const getUsersQuery = z.object({ ids, userFields });

export const getUserQuery = z.object({ userFields });

export const searchUsersQuery = z.object({
  query,
  followingOnly: transformToBoolean,
  userFields,
  limit,
  page,
});

export const signUpUserBody = z.object({ username, email, password, profile });

export const logInUserBody = z.object({
  login: z.string().trim(),
  password: z.string().trim(),
});
