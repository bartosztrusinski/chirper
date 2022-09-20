import { Types } from 'mongoose';
import { z } from 'zod';

const LIMIT_MIN = 1;
const LIMIT_MAX = 100;
const LIMIT_DEFAULT = 10;

const PAGE_DEFAULT = 1;
const PAGE_MIN = 1;
const PAGE_MAX = Math.floor(Number.MAX_SAFE_INTEGER / LIMIT_MAX);

export const CHIRP_DEFAULT_FIELD = 'content';
const CHIRP_ALLOWED_FIELDS = [
  'content',
  'author',
  'replies',
  'post',
  'parent',
  'metrics',
  '_id',
  'createdAt',
];

export const USER_DEFAULT_FIELD = 'username';
const USER_ALLOWED_FIELDS = [
  'username',
  'profile',
  'metrics',
  '_id',
  'createdAt',
];

// type ObjectId = z.infer<typeof objectId>;
export type UsernameInput = z.infer<typeof usernameInput>;
export type ChirpId = z.infer<typeof chirpIdSchema>;

const stringToBoolean = z
  .function()
  .args(z.string())
  .returns(z.boolean())
  .implement((str) => str === 'true');

const optionalStringToNumber = z
  .function()
  .args(z.string().optional())
  .returns(z.number().or(z.nan()))
  .implement((str) => {
    if (!str) return NaN;
    return parseInt(str);
  });

const setDefaultIfNaN = (defaultValue: number) =>
  z
    .function()
    .args(z.number().or(z.nan()))
    .returns(z.number())
    .implement((value) => {
      if (isNaN(value)) return defaultValue;
      return value;
    });

const clamp = (min: number, max: number) =>
  z
    .function()
    .args(z.number())
    .returns(z.number())
    .implement((value) => Math.min(Math.max(value, min), max));

const parseFields = (...allowedFields: string[]) =>
  z
    .function()
    .args(z.string())
    .returns(z.string())
    .implement((fields) => {
      return fields
        .split(',')
        .map((field) => field.trim())
        .filter((field) => allowedFields.includes(field))
        .reduce((fields, currentField) => fields + currentField + ' ', '');
    });

const addDefaultField = (defaultField: string) =>
  z
    .function()
    .args(z.string().optional())
    .returns(z.string())
    .implement((fields) => {
      if (!fields) return defaultField;
      return `${fields},${defaultField}`;
    });

const stringToId = z
  .function()
  .args(z.string(), z.any())
  .implement((str, ctx: z.RefinementCtx) => {
    try {
      return new Types.ObjectId(str);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Id must be valid',
      });
      return z.NEVER;
    }
  });

export const stringToDate = z
  .function()
  .args(z.string(), z.any())
  .implement((str, ctx: z.RefinementCtx) => {
    const parsedDate = Date.parse(str);
    if (isNaN(parsedDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be valid',
      });
      return z.NEVER;
    }
    return new Date(parsedDate);
  });

export const id = z.string().transform(stringToId);

export const ids = z
  .array(id, {
    invalid_type_error: 'Ids must be an array',
    required_error: 'Ids is required',
  })
  .min(1, 'You must provide at least one id')
  .max(100, 'You can only provide up to 100 ids');

export const chirpIdSchema = z.object({
  chirpId: id,
});

export const objectId = z.instanceof(Types.ObjectId, {
  message: 'Id must be valid',
});

export const includeReplies = z
  .string()
  .default('false')
  .transform(stringToBoolean);

export const expandAuthor = z
  .string()
  .default('false')
  .transform(stringToBoolean);

export const followingOnly = z
  .string()
  .default('false')
  .transform(stringToBoolean);

export const limit = z
  .string()
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(LIMIT_DEFAULT))
  .transform(clamp(LIMIT_MIN, LIMIT_MAX));

export const page = z
  .string()
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(PAGE_DEFAULT))
  .transform(clamp(PAGE_MIN, PAGE_MAX));

export const chirpFields = z
  .string()
  .optional()
  .transform(addDefaultField(CHIRP_DEFAULT_FIELD))
  .transform(parseFields(...CHIRP_ALLOWED_FIELDS));

export const userFields = z
  .string()
  .optional()
  .transform(addDefaultField(USER_DEFAULT_FIELD))
  .transform(parseFields(...USER_ALLOWED_FIELDS));

export const usernameInput = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
  }),
});

export const appendAuthorIfExpanded = z
  .function()
  .args(z.any())
  .implement((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
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

export type Password = z.infer<typeof password>;

export const email = z
  .string()
  .trim()
  .regex(
    /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please enter a valid email address'
  );

export type Email = z.infer<typeof email>;

export const username = z
  .string()
  .trim()
  .min(5, 'Username must be at least 5 characters')
  .max(50, 'Username must be less than 50 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username must only contain letters, numbers, and underscores'
  );

export type Username = z.infer<typeof username>;

export const name = z
  .string()
  .trim()
  .max(50, 'Profile name must be less than 50 characters')
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

export type Name = z.infer<typeof name>;

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
  .regex(
    /^(https?:\/\/)?(www.)?([a-z0-9]+\.)+[a-zA-Z]{2,}\/?(\/[a-zA-Z0-9#-_]+\/?)*$/,
    'Website URL must be valid'
  )
  .optional();

export const profile = z.object({
  name,
  bio,
  location,
  website,
  picture: z.string().optional(),
  header: z.string().optional(),
});

export type Profile = z.infer<typeof profile>;

const metrics = z.object({
  chirpCount: z.number().int().min(0).default(0),
  likedChirpCount: z.number().int().min(0).default(0),
  followingCount: z.number().int().min(0).default(0),
  followersCount: z.number().int().min(0).default(0),
});

const user = z.object({
  username,
  email,
  password,
  profile,
  metrics,
});

type User = z.infer<typeof user>;

export const responseBody = z.object({
  status: z.enum(['success', 'error', 'fail']),
  data: z.any(),
  meta: z.object({}),
});

export interface ResponseBody {
  data: object | null;
  meta?: object;
}
