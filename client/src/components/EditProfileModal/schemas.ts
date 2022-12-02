/* eslint-disable camelcase */
import { z } from 'zod';

const user = {
  fields: {
    default: 'username',
    allowed: ['username', 'profile', 'metrics', '_id', 'createdAt'],
  },
  username: {
    min: 5,
    max: 24,
  },
  password: {
    min: 8,
    max: 64,
  },
  name: {
    max: 24,
  },
  bio: {
    max: 160,
  },
  location: {
    max: 30,
  },
  website: {
    max: 100,
  },
} as const;

const createInputSchema = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.substring(1);
  return z
    .string({
      required_error: `${capitalizedName} is required`,
      invalid_type_error: `${capitalizedName} must be a string`,
    })
    .trim();
};

const name = createInputSchema('name')
  .min(1, 'Name cannot be empty')
  .max(user.name.max, `Profile name cannot exceed ${user.name.max} characters`)
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

const bio = createInputSchema('bio')
  .max(user.bio.max, `Description cannot exceed ${user.bio.max} characters`)
  .regex(/^[^<>]*$/, 'Description cannot include invalid characters')
  .or(z.literal(''));

const location = createInputSchema('location')
  .max(
    user.location.max,
    `Location cannot exceed ${user.location.max} characters`,
  )
  .regex(/^[^<>]*$/, 'Location cannot include invalid characters')
  .or(z.literal(''));

const website = createInputSchema('website')
  .max(
    user.website.max,
    `Website URL cannot exceed ${user.website.max} characters`,
  )
  .regex(
    /^(https?:\/\/)?(www.)?([a-z0-9]+\.)+[a-zA-Z]{2,}\/?(\/[a-zA-Z0-9#-_]+\/?)*$/,
    'Website URL must be valid',
  )
  .or(z.literal(''));

export { name, bio, location, website };
