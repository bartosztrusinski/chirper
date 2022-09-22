import { z } from 'zod';
import { profile, password, username, email } from '.';
import * as userSchemas from './user';

export const findOne = userSchemas.findOne;

export const updateProfile = profile;

export const updatePassword = z.object({
  password: z
    .string({
      invalid_type_error: 'Current password must be a string',
      required_error: 'Current password is required',
    })
    .trim(),
  newPassword: password,
});

export const updateUsername = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .trim(),
  newUsername: username,
});

export const updateEmail = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .trim(),
  newEmail: email,
});

export const deleteOne = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .trim(),
});

export type FindOne = z.infer<typeof findOne>;
export type UserProfile = z.infer<typeof updateProfile>;
export type UpdatePassword = z.infer<typeof updatePassword>;
export type UpdateUsername = z.infer<typeof updateUsername>;
export type UpdateEmail = z.infer<typeof updateEmail>;
export type DeleteOne = z.infer<typeof deleteOne>;
