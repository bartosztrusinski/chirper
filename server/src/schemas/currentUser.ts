import { z } from 'zod';
import { profile, password, username, email } from '.';

export type UserProfile = z.infer<typeof updateCurrentUserProfileBody>;
export type UpdateCurrentUserPasswordBody = z.infer<
  typeof updateCurrentUserPasswordBody
>;
export type UpdateCurrentUserUsernameBody = z.infer<
  typeof updateCurrentUserUsernameBody
>;
export type UpdateCurrentUserEmailBody = z.infer<
  typeof updateCurrentUserEmailBody
>;

export const updateCurrentUserProfileBody = profile;

export const updateCurrentUserPasswordBody = z.object({
  password: z.string().trim(),
  newPassword: password,
});

export const updateCurrentUserUsernameBody = z.object({
  password: z.string().trim(),
  newUsername: username,
});

export const updateCurrentUserEmailBody = z.object({
  password: z.string().trim(),
  newEmail: email,
});
