import { z } from 'zod';
import { id, limit, userFields } from '.';

const getUsersFromFollowsSchema = z.object({
  sinceId: id.optional(),
  userFields,
  limit,
});

export const getUserFollowings = getUsersFromFollowsSchema;
export const getUserFollowers = getUsersFromFollowsSchema;

export type GetUserFollowings = z.infer<typeof getUsersFromFollowsSchema>;
export type GetUserFollowers = z.infer<typeof getUsersFromFollowsSchema>;
