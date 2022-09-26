import { Model } from 'mongoose';
import { z } from 'zod';
import * as ChirpSchemas from './chirp.schemas';

export type Content = z.infer<typeof ChirpSchemas.content>;
export type Author = z.infer<typeof ChirpSchemas.author>;
export type Replies = z.infer<typeof ChirpSchemas.replies>;
export type Metrics = z.infer<typeof ChirpSchemas.metrics>;
export type MetricsField = keyof Metrics;
export type Chirp = z.infer<typeof ChirpSchemas.chirp>;
export type Post = z.infer<typeof ChirpSchemas.post>;
export type Reply = z.infer<typeof ChirpSchemas.reply>;
export type ChirpModel = Model<Chirp>;
export type PostModel = Model<Post>;
export type ReplyModel = Model<Reply>;

export type ChirpSortOrder = z.infer<typeof ChirpSchemas.chirpSortOrder>;

export type FindMany = z.infer<typeof ChirpSchemas._findMany>;
export type FindOne = z.infer<typeof ChirpSchemas._findOne>;
export type SearchMany = z.infer<typeof ChirpSchemas._searchMany>;
export type GetUserTimeline = z.infer<typeof ChirpSchemas._getUserTimeline>;
export type FindManyByUser = z.infer<typeof ChirpSchemas._findManyByUser>;
export type FindManyLiked = z.infer<typeof ChirpSchemas._findManyLiked>;
export type CreateOne = z.infer<typeof ChirpSchemas._createOne>;
