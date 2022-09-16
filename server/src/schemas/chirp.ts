import { z } from 'zod';
import {
  ids,
  chirpFields,
  userFields,
  limit,
  id,
  page,
  appendAuthorIfExpanded,
  followingOnly,
  expandAuthor,
  includeReplies,
  stringToDate,
} from '.';

const findManySchema = z.object({
  ids,
  chirpFields,
  userFields,
  expandAuthor,
});

const findOneSchema = z.object({
  chirpFields,
  userFields,
  expandAuthor,
});

const dateQuery = z.string().transform(stringToDate).optional();

const searchManySchema = z.object({
  query: z.string(),
  followingOnly,
  sortOrder: z.enum(['relevant', 'popular', 'recent']).default('relevant'),
  from: z.string().optional(),
  includeReplies,
  startTime: dateQuery,
  endTime: dateQuery,
  chirpFields,
  userFields,
  expandAuthor,
  limit,
  page,
});

const getUserTimelineSchema = z.object({
  sinceId: id.optional(),
  userFields,
  chirpFields,
  expandAuthor,
  limit,
});

const findManyByUserSchema = z.object({
  sinceId: id.optional(),
  userFields,
  chirpFields,
  expandAuthor,
  includeReplies,
  limit,
});

const findManyLikedSchema = z.object({
  sinceId: id.optional(),
  userFields,
  chirpFields,
  expandAuthor,
  limit,
});

const createOneSchema = z.object({
  content: z
    .string()
    .trim()
    .max(140, 'Chirp content must be less than 140 characters'),
  isReply: z.boolean().default(false),
  chirpId: id.optional(),
});

export const findMany = findManySchema.transform(appendAuthorIfExpanded);
export const findOne = findOneSchema.transform(appendAuthorIfExpanded);
export const searchMany = searchManySchema.transform(appendAuthorIfExpanded);
export const getUserTimeline = getUserTimelineSchema.transform(
  appendAuthorIfExpanded
);
export const findManyByUser = findManyByUserSchema.transform(
  appendAuthorIfExpanded
);
export const findManyLiked = findManyLikedSchema.transform(
  appendAuthorIfExpanded
);
export const createOne = createOneSchema;

export type FindMany = z.infer<typeof findManySchema>;
export type FindOne = z.infer<typeof findOneSchema>;
export type SearchMany = z.infer<typeof searchManySchema>;
export type GetUserTimeline = z.infer<typeof getUserTimelineSchema>;
export type FindManyByUser = z.infer<typeof findManyByUserSchema>;
export type FindManyLiked = z.infer<typeof findManyLikedSchema>;
export type CreateOne = z.infer<typeof createOneSchema>;
