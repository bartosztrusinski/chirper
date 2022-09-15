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

const getChirpsSchema = z.object({
  ids: ids,
  chirpFields,
  userFields,
  expandAuthor,
});

const getChirpSchema = z.object({
  chirpFields,
  userFields,
  expandAuthor,
});

const dateQuery = z.string().transform(stringToDate).optional();

const searchChirpsSchema = z.object({
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

const reverseChronologicalTimelineSchema = z.object({
  sinceId: id.optional(),
  userFields,
  chirpFields,
  expandAuthor,
  limit,
});

const createChirpSchema = z.object({
  content: z
    .string()
    .trim()
    .max(140, 'Chirp content must be less than 140 characters'),
  isReply: z.boolean().default(false),
  chirpId: id.optional(),
});

export const getChirps = getChirpsSchema.transform(appendAuthorIfExpanded);
export const getChirp = getChirpSchema.transform(appendAuthorIfExpanded);
export const searchChirps = searchChirpsSchema.transform(
  appendAuthorIfExpanded
);
export const reverseChronologicalTimeline =
  reverseChronologicalTimelineSchema.transform(appendAuthorIfExpanded);
export const createChirp = createChirpSchema;

export type GetChirps = z.infer<typeof getChirpsSchema>;
export type GetChirp = z.infer<typeof getChirpSchema>;
export type SearchChirps = z.infer<typeof searchChirpsSchema>;
export type CreateChirp = z.infer<typeof createChirpSchema>;
export type ReverseChronologicalTimeline = z.infer<
  typeof reverseChronologicalTimelineSchema
>;
