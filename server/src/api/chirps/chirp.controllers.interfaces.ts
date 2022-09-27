import { TypeOf } from 'zod';
import * as chirpSchemas from './chirp.schemas';

type FindMany = TypeOf<typeof chirpSchemas.findMany>;
type FindOne = TypeOf<typeof chirpSchemas.findOne>;
type SearchMany = TypeOf<typeof chirpSchemas.searchMany>;
type GetUserTimeline = TypeOf<typeof chirpSchemas.getUserTimeline>;
type FindManyByUser = TypeOf<typeof chirpSchemas.findManyByUser>;
type FindManyLiked = TypeOf<typeof chirpSchemas.findManyLiked>;
type CreateOne = TypeOf<typeof chirpSchemas.createOne>;
type DeleteOne = TypeOf<typeof chirpSchemas.deleteOne>;

export {
  FindMany,
  FindOne,
  SearchMany,
  GetUserTimeline,
  FindManyByUser,
  FindManyLiked,
  CreateOne,
  DeleteOne,
};
