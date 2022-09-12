import { z } from 'zod';
import {
  transformChirpFields,
  transformUserFields,
  transformExpandAuthor,
} from '../middleware/validation';
import { Types } from 'mongoose';

export const getChirpsQuery = z
  .object({
    ids: z
      .array(
        z.string().transform((id, ctx) => {
          try {
            return new Types.ObjectId(id);
          } catch (error) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'All ids must be valid',
            });
            return z.NEVER;
          }
        }),
        {
          invalid_type_error: 'Ids must be an array',
          required_error: 'Ids is required',
        }
      )
      .min(1, 'You must provide at least one id')
      .max(100, 'You can only request up to 100 chirps at a time'),
    userFields: z.string().optional().transform(transformUserFields),
    chirpFields: z.string().optional().transform(transformChirpFields),
    expandAuthor: z.string().trim().optional().transform(transformExpandAuthor),
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export type GetChirpsQuery = z.infer<typeof getChirpsQuery>;

export const getChirpQuery = z
  .object({
    userFields: z.string().optional().transform(transformUserFields),
    chirpFields: z.string().optional().transform(transformChirpFields),
    expandAuthor: z.string().trim().optional().transform(transformExpandAuthor),
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export type GetChirpQuery = z.infer<typeof getChirpQuery>;

// query,
//   followingOnly,
//   sortBy,
//   from,
//   includeReplies,
//   startTime,
//   endTime,
//   chirpFields,
//   userFields,
//   expandAuthor;
export const searchChirpsQuery = z
  .object({
    query: z.string(),
    followingOnly: z
      .string()
      .optional()
      .transform((val) => {
        return val === 'true';
      }),
    sortBy: z.enum(['relevant', 'popular', 'recent']).default('relevant'),
    from: z.string().optional(),
    includeReplies: z
      .string()
      .optional()
      .transform((val) => {
        return val === 'true';
      }),
    startTime: z
      .string()
      // .refine((val) => !isNaN(Date.parse(val)), {
      //   message: 'Start time must be a valid date',
      // })
      .transform((dateQuery, ctx) => {
        const parsedDate = Date.parse(dateQuery);
        if (isNaN(parsedDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Start time must be a valid date',
          });
          return z.NEVER;
        }
        return new Date(parsedDate);
      })
      .optional(),

    endTime: z
      .string()
      // .refine((val) => !isNaN(Date.parse(val)), {
      //   message: 'End time must be a valid date',
      // })
      .transform((dateQuery, ctx) => {
        const parsedDate = Date.parse(dateQuery);
        if (isNaN(parsedDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End time must be a valid date',
          });
          return z.NEVER;
        }
        return new Date(parsedDate);
      })
      .optional(),
    chirpFields: z.string().optional().transform(transformChirpFields),
    userFields: z.string().optional().transform(transformUserFields),
    expandAuthor: z.string().trim().optional().transform(transformExpandAuthor),
    limit: z.string().transform((limitQuery, ctx) => {
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
      if (limit < 5) return 5;

      return limit;
    }),
    page: z.string().transform((pageQuery, ctx) => {
      const page = parseInt(pageQuery);
      if (isNaN(page)) {
        // ctx.addIssue({
        //   code: z.ZodIssueCode.custom,
        //   message: 'Page must be a number',
        // });
        // return z.NEVER;
        return 1;
      }

      if (page < 1) return 1;

      return page;
    }),
  })
  .transform((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export type SearchChirpsQuery = z.infer<typeof searchChirpsQuery>;

// sinceId, expandAuthor, chirpFields, userFields, limit
// params username
export const reverseChronologicalTimelineQuery = z.object({
  sinceId: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), {
      message: 'Since id must be valid',
    })
    .optional(),
  userFields: z.string().optional().transform(transformUserFields),
  chirpFields: z.string().optional().transform(transformChirpFields),
  expandAuthor: z.string().trim().optional().transform(transformExpandAuthor),
  limit: z.string().transform((limitQuery, ctx) => {
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
    if (limit < 5) return 5;

    return limit;
  }),
});

export type ReverseChronologicalTimelineQuery = z.infer<
  typeof reverseChronologicalTimelineQuery
>;

// const { content, isReply, chirpId } = req.body;
export const createChirpBody = z.object({
  content: z
    .string()
    .max(140, 'Chirp content must be less than 140 characters'),
  // isReply: z
  //   .string()
  //   .optional()
  //   .transform((val) => {
  //     return val === 'true';
  // }),
  isReply: z.boolean().default(false),
  // chirpId: z
  //   .string()
  //   .refine((id) => Types.ObjectId.isValid(id), {
  //     message: 'Chirp id must be valid',
  //   })
  //   .optional(),
  chirpId: z.instanceof(Types.ObjectId).optional(),
});

export type CreateChirpBody = z.infer<typeof createChirpBody>;
