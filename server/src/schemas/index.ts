import { Types } from 'mongoose';
import { z } from 'zod';

export type CurrentUserId = z.infer<typeof currentUserIdSchema>;
export type Username = z.infer<typeof usernameSchema>;
export type ChirpId = z.infer<typeof chirpIdSchema>;

export const LIMIT_MIN = 1;
export const LIMIT_MAX = 100;
export const LIMIT_DEFAULT = 10;
export const PAGE_DEFAULT = 1;

export const clamp = (min: number, max: number) => (value: number) =>
  Math.min(Math.max(value, min), max);

export const limitClamp = clamp(LIMIT_MIN, LIMIT_MAX);

const transformOptionalFields = (...allowedFields: string[]) =>
  z
    .function()
    .args(z.string().optional())
    .returns(z.string())
    .implement((fields) => {
      fields = fields ? fields + `,${allowedFields[0]}` : allowedFields[0];
      return fields
        .split(',')
        .map((field) => field.trim().toLowerCase())
        .filter((field) => {
          return allowedFields
            .map((field) => field.toLowerCase())
            .includes(field);
        })
        .reduce((str, field) => {
          if (field === 'createdat') {
            field = 'createdAt';
          }
          return str + field + ' ';
        }, '');
    });

export const chirpFields = z
  .string()
  .optional()
  .transform(
    transformOptionalFields(
      'content',
      'author',
      'replies',
      'post',
      'parent',
      'metrics',
      '_id',
      'createdAt'
    )
  );

export const userFields = z
  .string()
  .optional()
  .transform(
    transformOptionalFields(
      'username',
      'profile',
      'metrics',
      '_id',
      'createdAt'
    )
  );

export const transformToBoolean = z
  .string()
  .optional()
  .transform((val) => {
    return val === 'true';
  });

export const currentUserIdSchema = z.instanceof(Types.ObjectId, {
  message: 'Current user id must be valid',
});

export const usernameSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
  }),
});

export const chirpIdSchema = z.object({
  chirpId: z.string().transform((id, ctx) => {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ChirpId must be valid',
      });
      return z.NEVER;
    }
  }),
});

export const password = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be less than 64 characters')
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[^\s<>]*$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  );

export const email = z.string().trim().email('Email must be a valid email');

export const username = z
  .string()
  .trim()
  .min(5, 'Username must be at least 5 characters')
  .max(50, 'Username must be less than 50 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username must only contain letters, numbers, and underscores'
  );

export const name = z
  .string()
  .trim()
  .max(50, 'Profile name must be less than 50 characters')
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

export const bio = z
  .string()
  .trim()
  .max(160, 'Description must be less than 160 characters')
  .regex(/^[^<>]*$/, 'Description cannot include invalid characters')
  .optional();

export const location = z
  .string()
  .trim()
  .max(30, 'Location must be less than 30 characters')
  .regex(/^[^<>]*$/, 'Location cannot include invalid characters')
  .optional();

export const website = z
  .string()
  .trim()
  .max(100, 'Website URL must be less than 100 characters')
  .url('Website must be a valid URL')
  .optional();

export const picture = z.string().optional();

export const header = z.string().optional();

export const profile = z.object({
  name,
  bio,
  location,
  website,
  picture,
  header,
});

export const ids = z
  .array(
    z.string().transform((id, ctx) => {
      try {
        return new Types.ObjectId(id);
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All ids must be valid',
        });
        return z.NEVER;
      }
    }),
    {
      invalid_type_error: 'Ids must be an array',
      required_error: 'Ids is required',
    }
  )
  .min(1, 'You must provide at least one id')
  .max(100, 'You can only provide up to 100 ids');

export const transformToId = z
  .string()
  .transform((id, ctx) => {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Id must be valid',
      });
      return z.NEVER;
    }
  })
  .optional();

export const query = z.string();

export const sort = z
  .enum(['relevant', 'popular', 'recent'])
  .default('relevant');

export const from = z.string().optional();

export const transformToDate = z
  .string()
  .transform((dateQuery, ctx) => {
    const parsedDate = Date.parse(dateQuery);
    if (isNaN(parsedDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be valid',
      });
      return z.NEVER;
    }
    return new Date(parsedDate);
  })
  .optional();

export const limit = z
  .string()
  .optional()
  .transform((limitQuery) => {
    if (!limitQuery) return LIMIT_DEFAULT;
    const limit = parseInt(limitQuery);
    if (isNaN(limit)) return LIMIT_DEFAULT;
    return limitClamp(limit);
  });

export const page = z
  .string()
  .optional()
  .transform((pageQuery) => {
    if (!pageQuery) return PAGE_DEFAULT;
    const page = parseInt(pageQuery);
    if (isNaN(page)) return PAGE_DEFAULT;
    return Math.max(page, 1);
  });
