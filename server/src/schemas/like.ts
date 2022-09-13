import { z } from 'zod';
import {
  transformChirpFields,
  transformUserFields,
  transformExpandAuthor,
} from '../middleware/validation';
import { Types } from 'mongoose';

// const { sinceId, userFields, limit } = req.query;
export const getLikingUsersQuery = z.object({
  // sinceId:
  // z.string()
  // .refine((id) => Types.ObjectId.isValid(id), {
  //   message: 'SinceId must be valid',
  // })
  // .optional(),
  sinceId: z
    .string()
    .transform((id, ctx) => {
      try {
        return new Types.ObjectId(id);
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SinceId must be valid',
        });
        return z.NEVER;
      }
    })
    .optional(),
  userFields: z.string().optional().transform(transformUserFields),
  limit: z
    .string()
    .optional()
    .transform((limitQuery, ctx) => {
      if (!limitQuery) return 10;

      const limit = parseInt(limitQuery);
      if (isNaN(limit)) {
        // ctx.addIssue({
        //   code: z.ZodIssueCode.custom,
        //   message: 'Limit must be a number',
        // });
        // return z.NEVER;
        return 10;
      }

      if (limit > 100) return 100;
      if (limit < 1) return 1;

      return limit;
    }),
});

export type GetLikingUsersQuery = z.infer<typeof getLikingUsersQuery>;

// const { sinceId, userFields, chirpFields, expandAuthor, limit } = req.query;
export const getLikedChirpsQuery = z
  .object({
    // sinceId: z
    //   .string()
    //   .refine((id) => Types.ObjectId.isValid(id), {
    //     message: 'SinceId must be valid',
    //   })
    //   .optional(),
    sinceId: z
      .string()
      .transform((id, ctx) => {
        try {
          return new Types.ObjectId(id);
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'SinceId must be valid',
          });
          return z.NEVER;
        }
      })
      .optional(),
    userFields: z.string().optional().transform(transformUserFields),
    chirpFields: z.string().optional().transform(transformChirpFields),
    expandAuthor: z.string().trim().optional().transform(transformExpandAuthor),
    limit: z
      .string()
      .optional()
      .transform((limitQuery, ctx) => {
        if (!limitQuery) return 10;

        const limit = parseInt(limitQuery);
        if (isNaN(limit)) {
          // ctx.addIssue({
          //   code: z.ZodIssueCode.custom,
          //   message: 'Limit must be a number',
          // });
          // return z.NEVER;
          return 10;
        }

        if (limit > 100) return 100;
        if (limit < 1) return 1;

        return limit;
      }),
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export type GetLikedChirpsQuery = z.infer<typeof getLikedChirpsQuery>;
