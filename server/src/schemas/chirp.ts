import { z } from 'zod';
import {
  ids,
  chirpFields,
  userFields,
  limit,
  id,
  page,
  appendAuthorIfExpanded,
  followedOnly,
  query,
  content,
  sortOrder,
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
  query,
  followedOnly,
  sortOrder,
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
  content,
  parentId: id.optional(),
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
