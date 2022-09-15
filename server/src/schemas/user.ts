import { z } from 'zod';
import {
  id,
  userFields,
  chirpFields,
  limit,
  ids,
  page,
  username,
  email,
  password,
  profile,
  expandAuthor,
  includeReplies,
  followingOnly,
  appendAuthorIfExpanded,
} from '.';

const getUserChirpsSchema = z.object({
  sinceId: id.optional(),
  userFields,
  chirpFields,
  expandAuthor,
  includeReplies,
  limit,
});

const getUsersSchema = z.object({ ids: ids, userFields });

const getUserSchema = z.object({ userFields });

const searchUsersSchema = z.object({
  query: z.string(),
  followingOnly,
  userFields,
  limit,
  page,
});

const signUpUserSchema = z.object({
  username,
  email,
  password,
  profile,
});

const logInUserSchema = z.object({
  login: z.string().trim(),
  password: z.string().trim(),
});

export const getUserChirps = getUserChirpsSchema.transform(
  appendAuthorIfExpanded
);
export const getUsers = getUsersSchema;
export const getUser = getUserSchema;
export const searchUsers = searchUsersSchema;
export const signUpUser = signUpUserSchema;
export const logInUser = logInUserSchema;

export type GetUserChirps = z.infer<typeof getUserChirpsSchema>;
export type GetUsers = z.infer<typeof getUsersSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
export type SearchUsers = z.infer<typeof searchUsersSchema>;
export type SignUpUser = z.infer<typeof signUpUserSchema>;
export type LogInUser = z.infer<typeof logInUserSchema>;
