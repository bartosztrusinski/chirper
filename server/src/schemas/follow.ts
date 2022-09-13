import { z } from 'zod';
import { transformUserFields } from '../middleware/validation';
import { Types } from 'mongoose';
// const { sinceId, userFields } = req.query; limit
export const getUserFollowingsQuery = z.object({
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
  // sinceId: z
  //   .string()
  //   .refine((id) => Types.ObjectId.isValid(id), {
  //     message: 'SinceId must be valid',
  //   })
  //   .optional(),
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

export type GetUserFollowingsQuery = z.infer<typeof getUserFollowingsQuery>;

// const { sinceId, userFields, limit } = req.query;
export const getUserFollowersQuery = z.object({
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

export type GetUserFollowersQuery = z.infer<typeof getUserFollowersQuery>;
