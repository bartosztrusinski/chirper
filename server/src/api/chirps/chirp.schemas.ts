import { number, object, enum as zodEnum, array, string } from 'zod';
import config from '../../config/request.config';
import {
  addDefaultField,
  createInputSchema,
  parseFields,
  stringToBoolean,
  stringToDate,
} from '../../utils/zodHelper.utils';
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
  chirpIdObject,
  usernameObject,
} from '../../schemas';

const from = createInputSchema('from').optional();

const parentId = stringId.optional();

const includeReplies = createInputSchema('includeReplies')
  .default('false')
  .transform(stringToBoolean);

const expandAuthor = createInputSchema('expandAuthor')
  .default('false')
  .transform(stringToBoolean);

const chirpFields = string()
  .optional()
  .transform(addDefaultField(config.chirp.fields.default))
  .transform(parseFields(config.chirp.fields.allowed));

const dateQuery = createInputSchema('date').transform(stringToDate).optional();

const sortOrder = zodEnum(config.chirp.sort.allowed, {
  errorMap: () => {
    return {
      message: `Sort order should be one of: ${config.chirp.sort.allowed.join(
        ', '
      )}`,
    };
  },
}).default(config.chirp.sort.default);

const content = createInputSchema('content')
  .max(
    config.chirp.content.max,
    `Chirp content cannot exceed ${config.chirp.content.max} characters`
  )
  .transform((content) => content.replace(/(\s*\n){2,}/g, '\n\n'));

const author = objectId;

const replies = array(objectId);

const metrics = object({
  likeCount: number().int().min(0).default(0),
});

const chirp = object({
  content,
  author,
  replies,
  metrics,
});

const post = chirp;

const reply = object(chirp.shape).merge(
  object({
    parent: objectId,
    post: objectId,
  })
);

const findMany = object({
  query: object({
    ids,
    chirpFields,
    userFields,
    expandAuthor,
    limit,
    sinceId,
  }),
});

const findOne = object({
  params: chirpIdObject,
  query: object({
    chirpFields,
    userFields,
    expandAuthor,
  }),
});

const searchMany = object({
  currentUserId: objectId.optional(),
  query: object({
    query,
    followedOnly,
    sortOrder,
    from,
    includeReplies,
    startTime: dateQuery,
    endTime: dateQuery,
    chirpFields,
    userFields,
    expandAuthor,
    limit,
    page,
  }),
});

const getReplies = object({
  params: chirpIdObject,
  query: object({
    chirpFields,
    userFields,
    expandAuthor,
    limit,
    sinceId,
  }),
});

const getUserTimeline = object({
  params: usernameObject,
  query: object({
    sinceId,
    userFields,
    chirpFields,
    expandAuthor,
    limit,
  }),
});

const findManyByUser = object({
  params: usernameObject,
  query: object({
    sinceId,
    userFields,
    chirpFields,
    expandAuthor,
    includeReplies,
    limit,
  }),
});

const findManyLiked = object({
  params: usernameObject,
  query: object({
    chirpIds: ids,
    sinceId,
    userFields,
    chirpFields,
    expandAuthor,
    limit,
  }),
});

const createOne = object({
  currentUserId: objectId,
  body: object({ content, parentId }),
});

const deleteOne = object({
  currentUserId: objectId,
  params: chirpIdObject,
});

export {
  chirp,
  post,
  reply,
  content,
  author,
  replies,
  metrics,
  findMany,
  findOne,
  searchMany,
  getReplies,
  sortOrder,
  deleteOne,
  createOne,
  findManyByUser,
  findManyLiked,
  getUserTimeline,
};
