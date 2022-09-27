import { Model } from 'mongoose';
import { TypeOf } from 'zod';
import * as chirpSchemas from './chirp.schemas';
import * as ChirpControllers from './chirp.controllers.interfaces';

type Chirp = TypeOf<typeof chirpSchemas.chirp>;
type Post = TypeOf<typeof chirpSchemas.post>;
type Reply = TypeOf<typeof chirpSchemas.reply>;

type ChirpModel = Model<Chirp>;
type PostModel = Model<Post>;
type ReplyModel = Model<Reply>;

type MetricsField = keyof Chirp['metrics'];

type SortOrder = TypeOf<typeof chirpSchemas.sortOrder>;

export {
  Chirp,
  Post,
  Reply,
  ChirpModel,
  PostModel,
  ReplyModel,
  MetricsField,
  SortOrder,
  ChirpControllers,
};
