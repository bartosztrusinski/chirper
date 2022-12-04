/* eslint-disable camelcase */
import { z } from 'zod';

const chirp = {
  fields: {
    default: 'content',
    allowed: [
      'content',
      'author',
      'replies',
      'post',
      'parent',
      'metrics',
      '_id',
      'createdAt',
    ],
  },
  content: {
    max: 140,
  },
  sort: {
    default: 'relevant',
    allowed: ['relevant', 'recent', 'popular'],
  },
} as const;

const createInputSchema = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return z
    .string({
      required_error: `${capitalizedName} is required`,
      invalid_type_error: `${capitalizedName} must be a string`,
    })
    .trim();
};

const content = createInputSchema('content').max(
  chirp.content.max,
  `Chirp content cannot exceed ${chirp.content.max} characters`,
);

export { content };
