import { z } from 'zod';
import {
  transformToId,
  userFields,
  limit,
  chirpFields,
  transformToBoolean,
} from '.';

export type GetLikingUsersQuery = z.infer<typeof getLikingUsersQuery>;
export type GetLikedChirpsQuery = z.infer<typeof getLikedChirpsQuery>;

export const getLikingUsersQuery = z.object({
  sinceId: transformToId,
  userFields,
  limit,
});

export const getLikedChirpsQuery = z
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
