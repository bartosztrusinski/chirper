import { z } from 'zod';
import {
  userFields,
  limit,
  ids,
  page,
  username,
  email,
  password,
  name,
  query,
  followedOnly,
  id,
} from '.';

export const findMany = z.object({ ids, userFields });

export const findOne = z.object({ userFields });

export const searchMany = z.object({
  query,
  followedOnly,
  userFields,
  limit,
  page,
});

export const findManyLiking = z.object({
  sinceId: id.optional(),
  userFields,
  limit,
});

const findUsersFromFollowsSchema = z.object({
  sinceId: id.optional(),
  userFields,
  limit,
});
export const findManyFollowing = findUsersFromFollowsSchema;
export const findManyFollowers = findUsersFromFollowsSchema;

export const signUp = z.object({
  username,
  email,
  password,
  name,
});

export const logIn = z.object({
  login: z
    .string({
      invalid_type_error: 'Login must be a string',
      required_error: 'Login is required',
    })
    .trim(),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .trim(),
});

export type FindMany = z.infer<typeof findMany>;
export type FindOne = z.infer<typeof findOne>;
export type SearchMany = z.infer<typeof searchMany>;
export type FindManyLiking = z.infer<typeof findManyLiking>;
export type FindManyFollowing = z.infer<typeof findManyFollowing>;
export type FindManyFollowers = z.infer<typeof findManyFollowers>;
export type SignUp = z.infer<typeof signUp>;
export type LogIn = z.infer<typeof logIn>;
