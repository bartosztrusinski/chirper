import { z } from 'zod';
import config from '../config/request';
import {
  ids,
  userFields,
  limit,
  page,
  followedOnly,
  query,
  sinceId,
  objectId,
  stringId,
} from './request';
import {
  addDefaultField,
  appendAuthorIfExpanded,
  createInputSchema,
  parseFields,
  stringToBoolean,
  stringToDate,
} from '../utils/zodFunctions';

const from = createInputSchema('from').optional();

const parentId = stringId.optional();

const includeReplies = createInputSchema('includeReplies')
  .default('false')
  .transform(stringToBoolean);

const expandAuthor = createInputSchema('expandAuthor')
  .default('false')
  .transform(stringToBoolean);

const chirpFields = z
  .string()
  .optional()
  .transform(addDefaultField(config.chirp.fields.default))
  .transform(parseFields(config.chirp.fields.allowed));

const dateQuery = createInputSchema('date').transform(stringToDate).optional();

export const chirpSortOrder = z
  .enum(config.chirp.sort.allowed, {
    errorMap: () => {
      return {
        message: `Sort order should be one of: ${config.chirp.sort.allowed.join(
          ', '
        )}`,
      };
    },
  })
  .default(config.chirp.sort.default);

export const content = createInputSchema('content').max(
  config.chirp.content.max,
  `Chirp content cannot exceed ${config.chirp.content.max} characters`
);

export const author = objectId;

export const replies = z.array(objectId);

export const metrics = z.object({
  likeCount: z.number().int().min(0).default(0),
});

export const chirp = z.object({
  content,
  author,
  replies,
  metrics,
});

export const post = chirp;

export const reply = z.object(chirp.shape).merge(
  z.object({
    parent: objectId,
    post: objectId,
  })
);

export const _findMany = z.object({
  ids,
  chirpFields,
  userFields,
  expandAuthor,
});

export const _findOne = z.object({
  chirpFields,
  userFields,
  expandAuthor,
});

export const _searchMany = z.object({
  query,
  followedOnly,
  sortOrder: chirpSortOrder,
  from,
  includeReplies,
  startTime: dateQuery,
  endTime: dateQuery,
  chirpFields,
  userFields,
  expandAuthor,
  limit,
  page,
});

export const _getUserTimeline = z.object({
  sinceId,
  userFields,
  chirpFields,
  expandAuthor,
  limit,
});

export const _findManyByUser = z.object({
  sinceId,
  userFields,
  chirpFields,
  expandAuthor,
  includeReplies,
  limit,
});

export const _findManyLiked = z.object({
  sinceId,
  userFields,
  chirpFields,
  expandAuthor,
  limit,
});

export const _createOne = z.object({ content, parentId });

export const findMany = _findMany.transform(appendAuthorIfExpanded);
export const findOne = _findOne.transform(appendAuthorIfExpanded);
export const searchMany = _searchMany.transform(appendAuthorIfExpanded);
export const getUserTimeline = _getUserTimeline.transform(
  appendAuthorIfExpanded
);
export const findManyByUser = _findManyByUser.transform(appendAuthorIfExpanded);
export const findManyLiked = _findManyLiked.transform(appendAuthorIfExpanded);
export const createOne = _createOne;
