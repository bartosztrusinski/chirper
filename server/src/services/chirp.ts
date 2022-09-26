import { FilterQuery, PopulateOptions, Types } from 'mongoose';
import config from '../config/request';
import { SortQuery } from '../types/general';
import { Chirp, MetricsField, Post, Reply } from '../types/chirp';
import * as LikeService from './like';
import ChirpModel, { PostChirp, ReplyChirp } from '../models/Chirp';
import { Like } from '../types/like';

const defaultFields = config.chirp.fields.default;

export const findMany = async (
  filter: FilterQuery<Chirp>,
  select: string = defaultFields,
  populate: PopulateOptions[] = [],
  sort?: SortQuery,
  limit?: number,
  skip?: number
) => {
  const query = ChirpModel.find(filter)
    .select(select)
    // .select({ score: { $meta: 'textScore' } })
    .populate(populate)
    .sort(sort);

  if (limit) query.limit(limit);
  if (skip) query.skip(skip);

  const chirps = await query;

  return chirps;
};

export const findOne = async (
  id: Types.ObjectId,
  select: string = defaultFields,
  populate: PopulateOptions[] = []
) => {
  const chirp = await ChirpModel.findById(id).select(select).populate(populate);

  if (!chirp) {
    throw new Error('Sorry, we could not find that chirp');
  }

  return chirp;
};

const createReply = async (
  content: string,
  author: Types.ObjectId,
  parentId: Types.ObjectId
) => {
  const parentChirp = await findOne(parentId);

  const parent = parentChirp._id;
  const post = parentChirp instanceof ReplyChirp ? parentChirp.post : parent;

  const reply = await ReplyChirp.create<Omit<Reply, 'metrics' | 'replies'>>({
    content,
    author,
    post,
    parent,
  });

  return reply._id;
};

const createPost = async (content: string, author: Types.ObjectId) => {
  const post = await PostChirp.create<Omit<Post, 'metrics' | 'replies'>>({
    content,
    author,
  });

  return post._id;
};

export const createOne = async (
  content: string,
  author: Types.ObjectId,
  parentId?: Types.ObjectId
) => {
  const chirpId = parentId
    ? await createReply(content, author, parentId)
    : await createPost(content, author);

  return chirpId;
};

export const deleteOne = async (id: Types.ObjectId) => {
  const chirp = await findOne(id);
  await chirp.remove();
};

export const findLikingUsersIds = async (
  chirp: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Like> = { chirp };
  if (sinceId) filter._id = { $lt: sinceId };

  const likes = await LikeService.findMany(filter, 'user', { _id: -1 }, limit);

  const likingUsersIds = likes.map((like) => like.user);
  const nextPage = likes[likes.length - 1]?._id;

  return { likingUsersIds, nextPage };
};

export const incrementMetrics = async (
  id: Types.ObjectId,
  ...metricsField: MetricsField[]
) => {
  const chirp = await findOne(id, 'metrics');
  const uniqueMetricsField = [...new Set(metricsField)];

  uniqueMetricsField.forEach((field) => {
    chirp.metrics[field]++;
  });

  await chirp.save();
};

export const decrementMetrics = async (
  id: Types.ObjectId,
  ...metricsField: MetricsField[]
) => {
  const chirp = await findOne(id, 'metrics');
  const uniqueMetricsField = [...new Set(metricsField)];

  uniqueMetricsField.forEach((field) => {
    chirp.metrics[field]--;
  });

  await chirp.save();
};

export const deleteMany = async (filter: FilterQuery<Chirp>) => {
  const chirps = await findMany(filter);
  await Promise.all(chirps.map((chirp) => chirp.remove()));
};

export const pushReply = async (
  id: Types.ObjectId,
  replyId: Types.ObjectId
) => {
  const chirp = await findOne(id, 'replies');
  chirp.replies.push(replyId);
  await chirp.save();
};

export const pullReply = async (
  id: Types.ObjectId,
  replyId: Types.ObjectId
) => {
  const chirp = await findOne(id, 'replies');
  chirp.replies = chirp.replies.filter((id) => !id.equals(replyId));
  await chirp.save();
};
