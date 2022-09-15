import { z } from 'zod';
import { profile, password, username, email } from '.';

const updateProfileSchema = profile;

const updatePasswordSchema = z.object({
  password: z.string().trim(),
  newPassword: password,
});

const updateUsernameSchema = z.object({
  password: z.string().trim(),
  newUsername: username,
});

const updateEmailSchema = z.object({
  password: z.string().trim(),
  newEmail: email,
});

export const updateProfile = updateProfileSchema;
export const updatePassword = updatePasswordSchema;
export const updateUsername = updateUsernameSchema;
export const updateEmail = updateEmailSchema;

export type UserProfile = z.infer<typeof updateProfileSchema>;
export type UpdatePassword = z.infer<typeof updatePasswordSchema>;
export type UpdateUsername = z.infer<typeof updateUsernameSchema>;
export type UpdateEmail = z.infer<typeof updateEmailSchema>;
