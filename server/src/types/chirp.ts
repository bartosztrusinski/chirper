import { z } from 'zod';
import * as ChirpSchemas from '../schemas/chirp';

export type ChirpSortOrder = z.infer<typeof ChirpSchemas.chirpSortOrder>;

export type FindMany = z.infer<typeof ChirpSchemas._findMany>;
export type FindOne = z.infer<typeof ChirpSchemas._findOne>;
export type SearchMany = z.infer<typeof ChirpSchemas._searchMany>;
export type GetUserTimeline = z.infer<typeof ChirpSchemas._getUserTimeline>;
export type FindManyByUser = z.infer<typeof ChirpSchemas._findManyByUser>;
export type FindManyLiked = z.infer<typeof ChirpSchemas._findManyLiked>;
export type CreateOne = z.infer<typeof ChirpSchemas._createOne>;
