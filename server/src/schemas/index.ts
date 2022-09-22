import { Types } from 'mongoose';
import { z } from 'zod';
import config from '../config/request';

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

const parseFields = (allowedFields: readonly string[]) =>
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

export const id = z
  .string({
    required_error: 'Id is required',
    invalid_type_error: 'Id must be a string',
  })
  .transform(stringToId);

export const ids = z
  .array(id, {
    invalid_type_error: 'Ids must be an array',
    required_error: 'Ids is required',
  })
  .nonempty({ message: 'You must provide at least one id' })
  .max(config.limit.max, `You can only provide up to ${config.limit.max} ids`);

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

export const followedOnly = z
  .string()
  .default('false')
  .transform(stringToBoolean);

export const limit = z
  .string()
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(config.limit.default))
  .transform(clamp(config.limit.min, config.limit.max));

export const page = z
  .string()
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(config.page.default))
  .transform(clamp(config.page.min, config.page.max));

export const chirpFields = z
  .string()
  .optional()
  .transform(addDefaultField(config.chirp.fields.default))
  .transform(parseFields(config.chirp.fields.allowed));

export const userFields = z
  .string()
  .optional()
  .transform(addDefaultField(config.user.fields.default))
  .transform(parseFields(config.user.fields.allowed));

export const usernameInput = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required',
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
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .trim()
  .min(
    config.user.password.min,
    `Password must be at least ${config.user.password.min} characters`
  )
  .max(
    config.user.password.max,
    `Password cannot exceed ${config.user.password.max} characters`
  )
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[^\s<>]*$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  );

export type Password = z.infer<typeof password>;

export const email = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .trim()
  .regex(
    /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please enter a valid email address'
  );

export type Email = z.infer<typeof email>;

export const username = z
  .string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
  .trim()
  .min(
    config.user.username.min,
    `Username must be at least ${config.user.username.min} characters`
  )
  .max(
    config.user.username.max,
    `Username cannot exceed ${config.user.username.max} characters`
  )
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username must only contain letters, numbers, and underscores'
  );

export type Username = z.infer<typeof username>;

export const query = z.string({
  required_error: 'Query is required',
  invalid_type_error: 'Query must be a string',
});

export const name = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .trim()
  .max(
    config.user.name.max,
    `Profile name cannot exceed ${config.user.name.max} characters`
  )
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

export type Name = z.infer<typeof name>;

export const bio = z
  .string({ invalid_type_error: 'Bio must be a string' })
  .trim()
  .max(
    config.user.bio.max,
    `Description cannot exceed ${config.user.bio.max} characters`
  )
  .regex(/^[^<>]*$/, 'Description cannot include invalid characters')
  .optional();

export const location = z
  .string({ invalid_type_error: 'Location must be a string' })
  .trim()
  .max(
    config.user.location.max,
    `Location cannot exceed ${config.user.location.max} characters`
  )
  .regex(/^[^<>]*$/, 'Location cannot include invalid characters')
  .optional();

export const website = z
  .string({ invalid_type_error: 'Website must be a string' })
  .trim()
  .max(
    config.user.website.max,
    `Website URL cannot exceed ${config.user.website.max} characters`
  )
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

// export const responseBody = z.object({
//   data: z.object({}),
//   meta: z.object({}),
// });

export const sortOrder = z
  .enum(config.chirp.sort.allowed, {
    errorMap: () => {
      return {
        message: `Sort order should be one of: ${config.chirp.sort.allowed.join(
          ', '
        )}`,
      };
    },
  })
  .default(config.chirp.sort.default);

export type SortOrder = z.infer<typeof sortOrder>;

export type ResponseData = object | null;
export type ResponseMeta = Record<string, unknown>;

// success response?
export interface ResponseBody {
  data: ResponseData;
  meta?: ResponseMeta;
}

export const content = z
  .string({
    required_error: 'Content is required',
    invalid_type_error: 'Content must be a string',
  })
  .trim()
  .max(
    config.chirp.content.max,
    `Chirp content cannot exceed ${config.chirp.content.max} characters`
  );
