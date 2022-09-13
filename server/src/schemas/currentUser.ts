import { z } from 'zod';

export const updateCurrentUserProfileBody = z.object({
  name: z
    .string()
    .trim()
    .max(50, 'Profile name must be less than 50 characters')
    .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters'),
  picture: z.string().optional(),
  header: z.string().optional(),
  bio: z
    .string()
    .trim()
    .max(160, 'Description must be less than 160 characters')
    .regex(/^[^<>]*$/, 'Description cannot include invalid characters')
    .optional(),
  location: z
    .string()
    .trim()
    .max(30, 'Location must be less than 30 characters')
    .regex(/^[^<>]*$/, 'Location cannot include invalid characters')
    .optional(),
  website: z
    .string()
    .trim()
    .max(100, 'Website URL must be less than 100 characters')
    .url('Website must be a valid URL')
    .optional(),
});

export type UserProfile = z.infer<typeof updateCurrentUserProfileBody>;

export const updateCurrentUserPasswordBody = z.object({
  password: z.string().trim(),
  newPassword: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters')
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[^\s<>]*$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    ),
});

export type UpdateCurrentUserPasswordBody = z.infer<
  typeof updateCurrentUserPasswordBody
>;

export const updateCurrentUserUsernameBody = z.object({
  password: z.string().trim(),
  newUsername: z
    .string()
    .trim()
    .min(5, 'Username must be at least 5 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username must only contain letters, numbers, and underscores'
    ),
});

export type UpdateCurrentUserUsernameBody = z.infer<
  typeof updateCurrentUserUsernameBody
>;

export const updateCurrentUserEmailBody = z.object({
  password: z.string().trim(),
  newEmail: z.string().trim().email('Email must be a valid email'),
});

export type UpdateCurrentUserEmailBody = z.infer<
  typeof updateCurrentUserEmailBody
>;
