import { z } from 'zod';
import {
  transformChirpFields,
  transformUserFields,
  transformExpandAuthor,
} from '../middleware/validation';
import { Types } from 'mongoose';

export const getUserChirpsQuery = z.object({
  sinceId: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), {
      message: 'Since id must be valid',
    })
    .optional(),
  userFields: z.string().optional().transform(transformUserFields),
  chirpFields: z.string().optional().transform(transformChirpFields),
  expandAuthor: z.string().trim().optional().transform(transformExpandAuthor),
  includeReplies: z
    .string()
    .optional()
    .transform((val) => {
      return val === 'true';
    }),
  limit: z.string().transform((limitQuery, ctx) => {
    const limit = parseInt(limitQuery);
    if (isNaN(limit)) {
      // ctx.addIssue({
      //   code: z.ZodIssueCode.custom,
      //   message: 'Limit must be a number',
      // });
      // return z.NEVER;
      return 10;
    }

    if (limit > 100) return 100;
    if (limit < 5) return 5;

    return limit;
  }),
});

export type GetUserChirpsQuery = z.infer<typeof getUserChirpsQuery>;

//const { ids, userFields } = req.query;
export const getUsersQuery = z.object({
  ids: z
    .array(
      z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'All ids must be valid',
      }),
      {
        invalid_type_error: 'Ids must be an array',
        required_error: 'Ids is required',
      }
    )
    .min(1, 'You must provide at least one id')
    .max(100, 'You can only request up to 100 chirps at a time'),
  userFields: z.string().optional().transform(transformUserFields),
});

export type GetUsersQuery = z.infer<typeof getUsersQuery>;

export const getUserQuery = z.object({
  userFields: z.string().optional().transform(transformUserFields),
});

export type GetUserQuery = z.infer<typeof getUserQuery>;

// const { query, followingOnly, userFields } = req.query;
export const searchUsersQuery = z.object({
  query: z.string(),
  followingOnly: z
    .string()
    .optional()
    .transform((val) => {
      return val === 'true';
    }),
  userFields: z.string().optional().transform(transformUserFields),
  limit: z.string().transform((limitQuery, ctx) => {
    const limit = parseInt(limitQuery);
    if (isNaN(limit)) {
      // ctx.addIssue({
      //   code: z.ZodIssueCode.custom,
      //   message: 'Limit must be a number',
      // });
      // return z.NEVER;
      return 10;
    }

    if (limit > 100) return 100;
    if (limit < 5) return 5;

    return limit;
  }),
  page: z.string().transform((pageQuery, ctx) => {
    const page = parseInt(pageQuery);
    if (isNaN(page)) {
      // ctx.addIssue({
      //   code: z.ZodIssueCode.custom,
      //   message: 'Page must be a number',
      // });
      // return z.NEVER;
      return 1;
    }

    if (page < 1) return 1;

    return page;
  }),
});

export type SearchUsersQuery = z.infer<typeof searchUsersQuery>;

export const signUpUserBody = z.object({
  username: z
    .string()
    .trim()
    .min(5, 'Username must be at least 5 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username must only contain letters, numbers, and underscores'
    ),
  email: z.string().trim().email('Email must be a valid email'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters')
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[^\s<>]*$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    ),
  profile: z.object({
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
  }),
});

export type SignUpUserBody = z.infer<typeof signUpUserBody>;

//login password
export const logInUserBody = z.object({
  login: z.string().trim(),
  password: z.string().trim(),
});

export type LogInUserBody = z.infer<typeof logInUserBody>;
