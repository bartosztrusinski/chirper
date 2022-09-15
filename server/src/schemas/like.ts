import { z } from 'zod';
import {
  id,
  userFields,
  limit,
  chirpFields,
  expandAuthor,
  appendAuthorIfExpanded,
} from '.';

const getLikingUsersSchema = z.object({
  sinceId: id.optional(),
  userFields,
  limit,
});

const getLikedChirpsSchema = z.object({
  sinceId: id.optional(),
  userFields,
  chirpFields,
  expandAuthor,
  limit,
});

export const getLikingUsers = getLikingUsersSchema;
export const getLikedChirps = getLikedChirpsSchema.transform(
  appendAuthorIfExpanded
);

export type GetLikingUsers = z.infer<typeof getLikingUsersSchema>;
export type GetLikedChirps = z.infer<typeof getLikedChirpsSchema>;
