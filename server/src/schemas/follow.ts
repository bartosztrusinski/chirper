import { z } from 'zod';
import { transformToId, limit, userFields } from '.';

export type GetUserFollowingsQuery = z.infer<typeof getUserFollowingsQuery>;
export type GetUserFollowersQuery = z.infer<typeof getUserFollowersQuery>;

export const getUserFollowingsQuery = z.object({
  sinceId: transformToId,
  userFields,
  limit,
});

export const getUserFollowersQuery = z.object({
  sinceId: transformToId,
  userFields,
  limit,
});
