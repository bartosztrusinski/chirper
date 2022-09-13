import { z } from 'zod';
import {
  ids,
  chirpFields,
  transformToBoolean,
  userFields,
  query,
  from,
  sort,
  transformToId,
  limit,
  page,
  transformToDate,
} from '.';

export type GetChirpsQuery = z.infer<typeof getChirpsQuery>;
export type GetChirpQuery = z.infer<typeof getChirpQuery>;
export type SearchChirpsQuery = z.infer<typeof searchChirpsQuery>;
export type CreateChirpBody = z.infer<typeof createChirpBody>;
export type ReverseChronologicalTimelineQuery = z.infer<
  typeof reverseChronologicalTimelineQuery
>;

export const getChirpsQuery = z
  .object({
    ids,
    chirpFields,
    userFields,
    expandAuthor: transformToBoolean,
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export const getChirpQuery = z
  .object({
    userFields,
    chirpFields,
    expandAuthor: transformToBoolean,
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export const searchChirpsQuery = z
  .object({
    query,
    followingOnly: transformToBoolean,
    sortBy: sort,
    from,
    includeReplies: transformToBoolean,
    startTime: transformToDate,
    endTime: transformToDate,
    chirpFields,
    userFields,
    expandAuthor: transformToBoolean,
    limit,
    page,
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export const reverseChronologicalTimelineQuery = z
  .object({
    sinceId: transformToId,
    userFields,
    chirpFields,
    expandAuthor: transformToBoolean,
    limit,
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export const createChirpBody = z.object({
  content: z
    .string()
    .max(140, 'Chirp content must be less than 140 characters'),
  isReply: z.boolean().default(false),
  chirpId: transformToId,
});
