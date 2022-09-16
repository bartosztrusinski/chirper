import { z } from 'zod';
import { profile, password, username, email } from '.';
import * as userSchemas from './user';

export const findOne = userSchemas.findOne;

export const updateProfile = profile;

export const updatePassword = z.object({
  password: z.string().trim(),
  newPassword: password,
});

export const updateUsername = z.object({
  password: z.string().trim(),
  newUsername: username,
});

export const updateEmail = z.object({
  password: z.string().trim(),
  newEmail: email,
});

export type UserProfile = z.infer<typeof updateProfile>;
export type UpdatePassword = z.infer<typeof updatePassword>;
export type UpdateUsername = z.infer<typeof updateUsername>;
export type UpdateEmail = z.infer<typeof updateEmail>;
