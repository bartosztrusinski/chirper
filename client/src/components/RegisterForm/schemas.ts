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

const usernameInput = createInputSchema('username');

const username = usernameInput
  .min(
    user.username.min,
    `Username must be at least ${user.username.min} characters`,
  )
  .max(
    user.username.max,
    `Username cannot exceed ${user.username.max} characters`,
  )
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username must only contain letters, numbers, and underscores',
  );

const email = createInputSchema('email').regex(
  /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  'Please enter a valid email address',
);

const passwordInput = createInputSchema('password');

const password = passwordInput
  .min(
    user.password.min,
    `Password must be at least ${user.password.min} characters`,
  )
  .max(
    user.password.max,
    `Password cannot exceed ${user.password.max} characters`,
  )
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d).*$/,
    'Password must contain lowercase letter, uppercase letter, and number',
  )
  .regex(/^[^\s<>]*$/, 'Password cannot include invalid characters');

const passwordConfirm = createInputSchema('password confirm');

const name = createInputSchema('name')
  .min(1, 'Name cannot be empty')
  .max(user.name.max, `Profile name cannot exceed ${user.name.max} characters`)
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

export { username, email, password, passwordConfirm, name };
